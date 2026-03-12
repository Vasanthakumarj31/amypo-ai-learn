// ─── Lightweight Evaluator ──────────────────────────────────────────────────
// A Puppeteer-free evaluator that uses regex/string-based HTML analysis.
// Used in deployment environments where headless Chrome is unavailable.
// ─────────────────────────────────────────────────────────────────────────────

export interface TestResult {
  name: string;
  category: string;
  passed: boolean;
  message: string;
}

export interface EvaluationResult {
  score: number;
  isCorrect: boolean;
  testResults: TestResult[];
  feedback: string[];
  studentScreenshot: string;
  referenceScreenshot: string;
  visualMatchPercent: number;
}

interface CodeBundle {
  html: string;
  css: string;
  js: string;
}

// ─── HTML Parsing Helpers ─────────────────────────────────────────────────

function countTags(html: string, tag: string): number {
  const regex = new RegExp(`<${tag}[\\s>]`, "gi");
  return (html.match(regex) || []).length;
}

function hasTag(html: string, tag: string): boolean {
  return countTags(html, tag) > 0;
}

function extractText(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function extractClasses(css: string): string[] {
  const matches = css.match(/\.[a-zA-Z_-][\w-]*/g) || [];
  return [...new Set(matches.map((m) => m.slice(1)))];
}

function hasCSSProperty(css: string, property: string): boolean {
  const regex = new RegExp(`${property}\\s*:`, "i");
  return regex.test(css);
}

function hasAttribute(html: string, attr: string): boolean {
  const regex = new RegExp(`${attr}\\s*=`, "i");
  return regex.test(html);
}

// ─── DOM-based Tests (string analysis) ──────────────────────────────────────

function runDOMTests(
  studentCode: CodeBundle,
  referenceCode: CodeBundle | null,
  expectedOutput: string
): TestResult[] {
  const tests: TestResult[] = [];
  const html = studentCode.html;
  const text = extractText(html);

  // Basic structure
  const elementCount =
    countTags(html, "div") +
    countTags(html, "span") +
    countTags(html, "p") +
    countTags(html, "h1") +
    countTags(html, "h2") +
    countTags(html, "h3") +
    countTags(html, "ul") +
    countTags(html, "ol") +
    countTags(html, "li") +
    countTags(html, "a") +
    countTags(html, "form") +
    countTags(html, "input") +
    countTags(html, "button") +
    countTags(html, "nav") +
    countTags(html, "header") +
    countTags(html, "footer") +
    countTags(html, "section") +
    countTags(html, "table") +
    countTags(html, "img");

  tests.push({
    name: "Document has content",
    category: "DOM Tests",
    passed: elementCount > 0 && text.length > 0,
    message:
      elementCount > 0
        ? `Found ${elementCount} elements with content`
        : "Page appears empty - add HTML content",
  });

  // Headings
  const h1Count = countTags(html, "h1");
  const h2Count = countTags(html, "h2");
  const h3Count = countTags(html, "h3");
  tests.push({
    name: "Contains heading element(s)",
    category: "DOM Tests",
    passed: h1Count > 0 || h2Count > 0 || h3Count > 0,
    message:
      h1Count > 0
        ? `Found ${h1Count} h1 heading(s)`
        : "No heading elements found - add h1, h2, or h3 tags",
  });

  // Reference-based tests
  if (referenceCode) {
    const refHtml = referenceCode.html;
    const refElementCount =
      countTags(refHtml, "div") +
      countTags(refHtml, "p") +
      countTags(refHtml, "h1") +
      countTags(refHtml, "h2") +
      countTags(refHtml, "ul") +
      countTags(refHtml, "a") +
      countTags(refHtml, "form") +
      countTags(refHtml, "input") +
      countTags(refHtml, "button");

    if (refElementCount > 0) {
      const ratio = elementCount / Math.max(refElementCount, 1);
      tests.push({
        name: "Element count matches reference",
        category: "DOM Tests",
        passed: ratio >= 0.6 && ratio <= 1.5,
        message:
          ratio >= 0.6
            ? `Element count is within expected range (${elementCount} vs ${refElementCount} reference)`
            : `Too few elements (${elementCount}) compared to reference (${refElementCount})`,
      });
    }

    // Check tag types
    const tagTypes = ["div", "p", "h1", "h2", "h3", "ul", "ol", "li", "a", "form", "input", "button", "nav", "table", "img"];
    const refTags = tagTypes.filter((t) => hasTag(refHtml, t));
    const studentTags = tagTypes.filter((t) => hasTag(html, t));
    const matching = refTags.filter((t) => studentTags.includes(t));
    const matchPct = Math.round((matching.length / Math.max(refTags.length, 1)) * 100);

    tests.push({
      name: "Uses expected HTML elements",
      category: "DOM Tests",
      passed: matchPct >= 70,
      message:
        matchPct >= 70
          ? `Using ${matchPct}% of expected element types`
          : `Only ${matchPct}% of expected element types found. Missing: ${refTags.filter((t) => !studentTags.includes(t)).join(", ")}`,
    });

    // Form elements
    if (hasTag(refHtml, "form")) {
      tests.push({
        name: "Contains form element(s)",
        category: "DOM Tests",
        passed: hasTag(html, "form"),
        message: hasTag(html, "form")
          ? `Found form element(s)`
          : "Missing form element - the reference includes a form",
      });

      const refInputs = countTags(refHtml, "input");
      const studentInputs = countTags(html, "input");
      if (refInputs > 0) {
        tests.push({
          name: "Form has required input fields",
          category: "DOM Tests",
          passed: studentInputs >= refInputs * 0.7,
          message:
            studentInputs >= refInputs * 0.7
              ? `Found ${studentInputs}/${refInputs} expected input fields`
              : `Only ${studentInputs}/${refInputs} input fields found`,
        });
      }
    }

    // Lists
    const refLists = countTags(refHtml, "ul") + countTags(refHtml, "ol");
    if (refLists > 0) {
      const studentLists = countTags(html, "ul") + countTags(html, "ol");
      tests.push({
        name: "Contains list element(s)",
        category: "DOM Tests",
        passed: studentLists > 0,
        message:
          studentLists > 0
            ? `Found ${studentLists} list(s)`
            : `Missing list elements (reference has ${refLists})`,
      });
    }

    // Links
    if (hasTag(refHtml, "a")) {
      tests.push({
        name: "Contains anchor/link elements",
        category: "DOM Tests",
        passed: hasTag(html, "a"),
        message: hasTag(html, "a")
          ? `Found link element(s)`
          : "Missing anchor tags - the reference includes links",
      });
    }

    // Buttons
    const refButtons = countTags(refHtml, "button");
    if (refButtons > 0) {
      const studentButtons = countTags(html, "button");
      tests.push({
        name: "Contains button element(s)",
        category: "DOM Tests",
        passed: studentButtons >= refButtons,
        message:
          studentButtons >= refButtons
            ? `Found ${studentButtons} button(s)`
            : `Only ${studentButtons}/${refButtons} buttons found`,
      });
    }
  }

  // Expected output matching
  if (expectedOutput) {
    const keywords = expectedOutput
      .toLowerCase()
      .split(/[,.\s]+/)
      .filter((w) => w.length > 3);
    const htmlLower = html.toLowerCase() + " " + text.toLowerCase();

    const elementChecks: { keyword: string; check: boolean }[] = [];
    if (expectedOutput.toLowerCase().includes("h1"))
      elementChecks.push({ keyword: "h1", check: hasTag(html, "h1") });
    if (expectedOutput.toLowerCase().includes("form"))
      elementChecks.push({ keyword: "form", check: hasTag(html, "form") });
    if (expectedOutput.toLowerCase().includes("ul") || expectedOutput.toLowerCase().includes("list"))
      elementChecks.push({ keyword: "list", check: hasTag(html, "ul") || hasTag(html, "ol") });
    if (expectedOutput.toLowerCase().includes("anchor") || expectedOutput.toLowerCase().includes("link"))
      elementChecks.push({ keyword: "link/anchor", check: hasTag(html, "a") });
    if (expectedOutput.toLowerCase().includes("button"))
      elementChecks.push({ keyword: "button", check: hasTag(html, "button") });

    if (elementChecks.length > 0) {
      const passedChecks = elementChecks.filter((c) => c.check);
      tests.push({
        name: "Contains expected elements from description",
        category: "DOM Tests",
        passed: passedChecks.length >= elementChecks.length * 0.7,
        message:
          passedChecks.length >= elementChecks.length * 0.7
            ? `Found ${passedChecks.length}/${elementChecks.length} expected elements`
            : `Missing elements: ${elementChecks.filter((c) => !c.check).map((c) => c.keyword).join(", ")}`,
      });
    }

    const relevantKeywords = keywords.filter((k) => htmlLower.includes(k));
    const relevancePct = keywords.length
      ? Math.round((relevantKeywords.length / keywords.length) * 100)
      : 100;

    tests.push({
      name: "Content matches expected output description",
      category: "DOM Tests",
      passed: relevancePct >= 30,
      message:
        relevancePct >= 30
          ? `Content relevance: ${relevancePct}%`
          : `Low content relevance (${relevancePct}%). Review the expected output description.`,
    });
  }

  return tests;
}

// ─── CSS Tests ──────────────────────────────────────────────────────────────

function runCSSTests(
  studentCode: CodeBundle,
  referenceCode: CodeBundle | null
): TestResult[] {
  const tests: TestResult[] = [];
  const css = studentCode.css;

  // Background styles
  const hasBackground = hasCSSProperty(css, "background") || hasCSSProperty(css, "background-color");
  tests.push({
    name: "Custom background styles applied",
    category: "CSS Style Tests",
    passed: hasBackground,
    message: hasBackground
      ? "Background styles detected"
      : "No custom background colors found - add CSS styling",
  });

  // Layout
  const usesFlexbox = hasCSSProperty(css, "display") && css.includes("flex");
  const usesGrid = hasCSSProperty(css, "display") && css.includes("grid");

  tests.push({
    name: "Uses modern layout (Flexbox or Grid)",
    category: "CSS Style Tests",
    passed: usesFlexbox || usesGrid,
    message: usesFlexbox
      ? "Flexbox layout detected"
      : usesGrid
        ? "CSS Grid layout detected"
        : "No Flexbox or Grid layout detected - consider using modern layout methods",
  });

  // Reference comparison
  if (referenceCode) {
    const refCss = referenceCode.css;
    const refFlexbox = refCss.includes("flex");
    const refGrid = refCss.includes("grid");

    if (refFlexbox || refGrid) {
      tests.push({
        name: "Layout method matches reference",
        category: "CSS Style Tests",
        passed: (refFlexbox && usesFlexbox) || (refGrid && usesGrid),
        message:
          (refFlexbox && usesFlexbox) || (refGrid && usesGrid)
            ? "Layout method matches the reference"
            : `Reference uses ${refFlexbox ? "Flexbox" : "Grid"} but your code does not`,
      });
    }

    // Class usage comparison
    const refClasses = extractClasses(refCss);
    const studentClasses = extractClasses(css);
    if (refClasses.length > 0) {
      const matchingClasses = refClasses.filter((c) => studentClasses.includes(c));
      const classPct = Math.round((matchingClasses.length / refClasses.length) * 100);
      tests.push({
        name: "CSS class names match reference",
        category: "CSS Style Tests",
        passed: classPct >= 50,
        message:
          classPct >= 50
            ? `${classPct}% of reference CSS classes are present`
            : `Only ${classPct}% of reference CSS classes found`,
      });
    }
  }

  return tests;
}

// ─── JS Tests ───────────────────────────────────────────────────────────────

function runJSTests(studentCode: CodeBundle, referenceCode: CodeBundle | null): TestResult[] {
  const tests: TestResult[] = [];
  const js = studentCode.js;

  if (!js || js.trim().length === 0) {
    return tests;
  }

  // Check for syntax issues (basic heuristic)
  const openBraces = (js.match(/{/g) || []).length;
  const closeBraces = (js.match(/}/g) || []).length;
  const openParens = (js.match(/\(/g) || []).length;
  const closeParens = (js.match(/\)/g) || []).length;

  tests.push({
    name: "No obvious syntax issues",
    category: "JavaScript Tests",
    passed: openBraces === closeBraces && openParens === closeParens,
    message:
      openBraces === closeBraces && openParens === closeParens
        ? "Brackets and parentheses are balanced"
        : "Mismatched brackets or parentheses detected",
  });

  // Check for event listeners
  const hasEventListeners = js.includes("addEventListener") || js.includes("onclick");
  const hasButtons = hasTag(studentCode.html, "button");
  if (hasButtons) {
    tests.push({
      name: "Event listeners attached",
      category: "JavaScript Tests",
      passed: hasEventListeners,
      message: hasEventListeners
        ? "Event listeners detected for interactive elements"
        : "No event listeners found - buttons may not be interactive",
    });
  }

  // Check DOM manipulation
  const hasDomAccess =
    js.includes("getElementById") ||
    js.includes("querySelector") ||
    js.includes("getElementsBy") ||
    js.includes("document.");
  tests.push({
    name: "Uses DOM API",
    category: "JavaScript Tests",
    passed: hasDomAccess,
    message: hasDomAccess
      ? "DOM API usage detected"
      : "No DOM access detected - use document methods to interact with the page",
  });

  // Reference comparison
  if (referenceCode && referenceCode.js) {
    const refJs = referenceCode.js;
    const refHasListeners = refJs.includes("addEventListener");
    const refHasFetch = refJs.includes("fetch(") || refJs.includes("fetch (");

    if (refHasListeners && !hasEventListeners) {
      tests.push({
        name: "Implements event handling like reference",
        category: "JavaScript Tests",
        passed: false,
        message: "Reference uses event listeners but yours does not",
      });
    }

    if (refHasFetch) {
      const hasFetch = js.includes("fetch(") || js.includes("fetch (");
      tests.push({
        name: "Uses Fetch API like reference",
        category: "JavaScript Tests",
        passed: hasFetch,
        message: hasFetch
          ? "Fetch API usage detected"
          : "Reference uses Fetch API but yours does not",
      });
    }
  }

  return tests;
}

// ─── Feedback Generator ─────────────────────────────────────────────────────

function generateFeedback(testResults: TestResult[]): string[] {
  const feedback: string[] = [];
  const passed = testResults.filter((t) => t.passed).length;
  const total = testResults.length;

  if (passed === total) {
    feedback.push("Excellent work! All tests passed.");
  } else if (passed >= total * 0.7) {
    feedback.push("Good progress! Most tests are passing.");
  } else {
    feedback.push("Keep working - several tests need attention.");
  }

  const failedByCategory: Record<string, TestResult[]> = {};
  testResults
    .filter((t) => !t.passed)
    .forEach((t) => {
      if (!failedByCategory[t.category]) failedByCategory[t.category] = [];
      failedByCategory[t.category].push(t);
    });

  for (const [category, failures] of Object.entries(failedByCategory)) {
    if (category === "DOM Tests") {
      feedback.push(`HTML Structure: ${failures.map((f) => f.message).join(". ")}`);
    } else if (category === "CSS Style Tests") {
      feedback.push(`CSS Styling: ${failures.map((f) => f.message).join(". ")}`);
    } else if (category === "JavaScript Tests") {
      feedback.push(`JavaScript: ${failures.map((f) => f.message).join(". ")}`);
    }
  }

  feedback.push("Note: Lightweight evaluation mode - visual comparison not available in this environment.");

  return feedback;
}

// ─── Main Evaluation Function ───────────────────────────────────────────────

export async function evaluateSubmission(
  studentCode: CodeBundle,
  referenceCode: CodeBundle | null,
  expectedOutput: string
): Promise<EvaluationResult> {
  const domTests = runDOMTests(studentCode, referenceCode, expectedOutput);
  const cssTests = runCSSTests(studentCode, referenceCode);
  const jsTests = runJSTests(studentCode, referenceCode);

  const allTests = [...domTests, ...cssTests, ...jsTests];

  const passedCount = allTests.filter((t) => t.passed).length;
  const totalCount = allTests.length;
  let score = totalCount > 0 ? Math.round((passedCount / totalCount) * 100) : 0;
  score = Math.min(100, Math.max(0, score));

  const feedback = generateFeedback(allTests);

  return {
    score,
    isCorrect: score >= 70,
    testResults: allTests,
    feedback,
    studentScreenshot: "",
    referenceScreenshot: "",
    visualMatchPercent: 0,
  };
}

export async function closeBrowser(): Promise<void> {
  // No-op in light evaluator
}
