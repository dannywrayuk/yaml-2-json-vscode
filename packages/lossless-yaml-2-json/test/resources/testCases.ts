import { testCase } from "./types";

export const testCases: testCase[] = [
  {
    description: "an empty string",
    yaml: "",
    json: "",
  },
  {
    description: "a string",
    yaml: `value
`,
    json: '"value"',
  },
  {
    description: "a number",
    yaml: `123
`,
    json: "123",
  },
  {
    description: "a boolean",
    yaml: `true
`,
    json: "true",
  },
  {
    description: "an array",
    yaml: `- valueI
- valueJ
- valueK
`,
    json: `[
  "valueI",
  "valueJ",
  "valueK"
]`,
  },
  {
    description: "an array of pairs",
    yaml: `- keyA: valueI
- keyB: valueJ
- keyC: valueK
`,
    json: `[
  {
    "keyA": "valueI"
  },
  {
    "keyB": "valueJ"
  },
  {
    "keyC": "valueK"
  }
]`,
  },
  {
    description: "a key value pair",
    yaml: `keyA: valueA
`,
    json: `{
  "keyA": "valueA"
}`,
  },
  {
    description: "a key value pair list",
    yaml: `keyA: valueA
keyB: valueB
keyC: valueC
`,
    json: `{
  "keyA": "valueA",
  "keyB": "valueB",
  "keyC": "valueC"
}`,
  },
  {
    description: "a key value pair nested list",
    yaml: `keyA: valueA
keyB:
  nestA: valueX
  nextB: valueY
keyC: valueC
`,
    json: `{
  "keyA": "valueA",
  "keyB": {
    "nestA": "valueX",
    "nextB": "valueY"
  },
  "keyC": "valueC"
}`,
  },
  {
    description: "a key value pair deeply nested list",
    yaml: `keyA: valueA
keyB:
  nestA:
    nest1A:
      nest2A: value2X
      nest2B:
        nest3A: value3X
  nextB: valueY
keyC: valueC
`,
    json: `{
  "keyA": "valueA",
  "keyB": {
    "nestA": {
      "nest1A": {
        "nest2A": "value2X",
        "nest2B": {
          "nest3A": "value3X"
        }
      }
    },
    "nextB": "valueY"
  },
  "keyC": "valueC"
}`,
  },
  {
    description: "a key value pair nested list with array",
    yaml: `keyA: valueA
keyB:
  nestA:
    - valueI
    - valueJ
    - valueK
  nextB: valueY
keyC: valueC
`,
    json: `{
  "keyA": "valueA",
  "keyB": {
    "nestA": [
      "valueI",
      "valueJ",
      "valueK"
    ],
    "nextB": "valueY"
  },
  "keyC": "valueC"
}`,
  },
  {
    description: "a real world example - basic",
    yaml: `name: codelens-sample
displayName: CodeLens Sample
description: Samples for VS Code's CodeLens API
version: 0.0.1
publisher: ms-vscode
private: true
license: MIT
repository:
  type: git
  url: https://github.com/Microsoft/vscode-extension-samples
engines:
  vscode: ^1.26.0
categories:
  - Other
activationEvents:
  - "*"
main: ./out/extension
contributes:
  commands:
    - title: Enable CodeLens
      command: codelens-sample.enableCodeLens
      category: CodeLens Sample
    - title: Disable Codelens
      command: codelens-sample.disableCodeLens
      category: CodeLens Sample
  configuration:
    properties:
      codelens-sample.enableCodeLens:
        type: boolean
        default: true
scripts:
  vscode:prepublish: npm run compile
  compile: tsc -p ./
  lint: eslint . --ext .ts,.tsx
  watch: tsc -watch -p ./
devDependencies:
  "@types/node": ^16.11.7
  "@types/vscode": ^1.26.0
  "@typescript-eslint/eslint-plugin": ^5.30.0
  "@typescript-eslint/parser": ^5.30.0
  eslint: ^8.13.0
  typescript: ^4.8.4
`,
    json: `{
  "name": "codelens-sample",
  "displayName": "CodeLens Sample",
  "description": "Samples for VS Code's CodeLens API",
  "version": "0.0.1",
  "publisher": "ms-vscode",
  "private": true,
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/Microsoft/vscode-extension-samples"
  },
  "engines": {
    "vscode": "^1.26.0"
  },
  "categories": [
    "Other"
  ],
  "activationEvents": [
    "*"
  ],
  "main": "./out/extension",
  "contributes": {
    "commands": [
      {
        "title": "Enable CodeLens",
        "command": "codelens-sample.enableCodeLens",
        "category": "CodeLens Sample"
      },
      {
        "title": "Disable Codelens",
        "command": "codelens-sample.disableCodeLens",
        "category": "CodeLens Sample"
      }
    ],
    "configuration": {
      "properties": {
        "codelens-sample.enableCodeLens": {
          "type": "boolean",
          "default": true
        }
      }
    }
  },
  "scripts": {
    "vscode:prepublish": "npm run compile",
    "compile": "tsc -p ./",
    "lint": "eslint . --ext .ts,.tsx",
    "watch": "tsc -watch -p ./"
  },
  "devDependencies": {
    "@types/node": "^16.11.7",
    "@types/vscode": "^1.26.0",
    "@typescript-eslint/eslint-plugin": "^5.30.0",
    "@typescript-eslint/parser": "^5.30.0",
    "eslint": "^8.13.0",
    "typescript": "^4.8.4"
  }
}`,
  },
  {
    description: "a lone anchor",
    yaml: `keyA: valueA
keyB: &anchorB valueB
keyC: valueC
`,
    json: `{
  "keyA": "valueA",
  "keyB": "valueB",
  "keyC": "valueC",
  "&anchorB": "keyB"
}`,
  },
  {
    description: "an anchor and source",
    yaml: `keyA: valueA
keyB: &anchorB valueB
keyC: *anchorB
`,
    json: `{
  "keyA": "valueA",
  "keyB": "valueB",
  "keyC": "*anchorB",
  "&anchorB": "keyB"
}`,
  },
  {
    description: "an anchor and source to a list",
    yaml: `keyA: valueA
keyB: &anchorB
  nestA: valueX
  nestB: valueY
keyC: *anchorB
`,
    json: `{
  "keyA": "valueA",
  "keyB": {
    "nestA": "valueX",
    "nestB": "valueY"
  },
  "keyC": "*anchorB",
  "&anchorB": "keyB"
}`,
  },
  {
    description: "an anchor and source override",
    yaml: `keyA: valueA
keyB: &anchorB
  nestA: valueX
  nestB: valueY
keyC:
  <<: *anchorB
  nestA: valueZ
`,
    json: `{
  "keyA": "valueA",
  "keyB": {
    "nestA": "valueX",
    "nestB": "valueY"
  },
  "keyC": {
    "<<anchorB": "*anchorB",
    "nestA": "valueZ"
  },
  "&anchorB": "keyB"
}`,
  },
  {
    description: "multiple anchor and source overrides",
    yaml: `keyA: valueA
keyB: &anchorB
  nestA: valueX
  nestB: valueY
keyC: &anchorC
  nestA: valueX
  nestB: valueY
keyD:
  <<: *anchorB
  nestA: valueZ
  <<: *anchorC
`,
    json: `{
  "keyA": "valueA",
  "keyB": {
    "nestA": "valueX",
    "nestB": "valueY"
  },
  "keyC": {
    "nestA": "valueX",
    "nestB": "valueY"
  },
  "keyD": {
    "<<anchorB": "*anchorB",
    "nestA": "valueZ",
    "<<anchorC": "*anchorC"
  },
  "&anchorB": "keyB",
  "&anchorC": "keyC"
}`,
  },
  {
    description: "nested anchors",
    yaml: `keyA: valueA
keyB: &anchorB
  nestA: valueX
  nestB: &anchorY valueY
keyC:
  nestA: *anchorB
  nestB: *anchorY
`,
    json: `{
  "keyA": "valueA",
  "keyB": {
    "nestA": "valueX",
    "nestB": "valueY",
    "&anchorY": "nestB"
  },
  "keyC": {
    "nestA": "*anchorB",
    "nestB": "*anchorY"
  },
  "&anchorB": "keyB"
}`,
  },
  {
    description: "anchors in array",
    yaml: `keyA: valueA
keyB:
  - array1
  - &anchorC array2
  - array3
keyC: *anchorC
`,
    json: `{
  "keyA": "valueA",
  "keyB": [
    "array1",
    "array2",
    "array3"
  ],
  "keyC": "*anchorC",
  "&anchorC": "keyB:1"
}`,
  },
];
