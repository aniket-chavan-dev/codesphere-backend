import React from "react";
import { ChevronRight } from "lucide-react";

export default function MarkdownHelper() {
  const examples = [
    {
      title: "Headings",
      markdown: `# Heading 1\n## Heading 2\n### Heading 3`,
      output: (
        <div>
          <h1 className="text-2xl font-bold mb-1">Heading 1</h1>
          <h2 className="text-xl font-semibold mb-1">Heading 2</h2>
          <h3 className="text-lg font-medium">Heading 3</h3>
        </div>
      ),
    },
    {
      title: "Bold & Italic",
      markdown: `**Bold text** and *Italic text*`,
      output: (
        <p>
          <strong>Bold text</strong> and <em>Italic text</em>
        </p>
      ),
    },
    {
      title: "Lists",
      markdown: `- Item 1\n- Item 2\n  - Sub-item 2.1\n  - Sub-item 2.2`,
      output: (
        <ul className="list-disc ml-5">
          <li>Item 1</li>
          <li>
            Item 2
            <ul className="list-circle ml-6">
              <li>Sub-item 2.1</li>
              <li>Sub-item 2.2</li>
            </ul>
          </li>
        </ul>
      ),
    },
    {
      title: "Code (Inline & Block)",
      markdown: `Here is some \`inline code\`\n\n\`\`\`python\ndef hello():\n    print("Hello World")\n\`\`\``,
      output: (
        <div>
          <p>
            Here is some{" "}
            <code className="bg-[#1e1e22] px-1 rounded text-blue-400">
              inline code
            </code>
          </p>
          <pre className="bg-[#1a1a1d] p-3 rounded-md text-sm mt-2">
            <code>def hello():{"\n"} print("Hello World")</code>
          </pre>
        </div>
      ),
    },
    {
      title: "Links",
      markdown: `[OpenAI](https://openai.com)`,
      output: (
        <a
          href="https://openai.com"
          target="_blank"
          rel="noreferrer"
          className="text-blue-400 underline"
        >
          OpenAI
        </a>
      ),
    },
    {
      title: "Tables",
      markdown: `| Name | Age |\n|------|-----|\n| John | 25  |\n| Mary | 30  |`,
      output: (
        <table className="border border-gray-700 text-left text-sm">
          <thead>
            <tr>
              <th className="border border-gray-700 px-2 py-1">Name</th>
              <th className="border border-gray-700 px-2 py-1">Age</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-700 px-2 py-1">John</td>
              <td className="border border-gray-700 px-2 py-1">25</td>
            </tr>
            <tr>
              <td className="border border-gray-700 px-2 py-1">Mary</td>
              <td className="border border-gray-700 px-2 py-1">30</td>
            </tr>
          </tbody>
        </table>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#111113] text-gray-200 p-8">
      <h1 className="text-3xl font-bold text-green-500 mb-6 border-b border-gray-700 pb-3">
        Markdown Helper Guide
      </h1>

      <p className="text-gray-400 mb-8">
        Use this guide to write clean, well-formatted markdown for your solution
        posts. The preview in your editor will automatically render markdown
        just like this.
      </p>

      <div className="space-y-8">
        {examples.map((item, index) => (
          <div
            key={index}
            className="bg-[#161618] border border-gray-700 rounded-xl p-6 shadow-md"
          >
            <div className="flex items-center gap-2 mb-3">
              <ChevronRight className="text-green-400" />
              <h2 className="text-lg font-semibold text-white">{item.title}</h2>
            </div>

            <div className="grid grid-cols-2 gap-5">
              {/* Markdown syntax block */}
              <div>
                <p className="text-sm text-gray-400 mb-1">Markdown</p>
                <pre className="bg-[#1a1a1d] p-3 rounded-md text-sm overflow-x-auto border border-gray-700">
                  {item.markdown}
                </pre>
              </div>

              {/* Output preview */}
              <div>
                <p className="text-sm text-gray-400 mb-1">Preview</p>
                <div className="bg-[#1a1a1d] p-3 rounded-md border border-gray-700">
                  {item.output}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
