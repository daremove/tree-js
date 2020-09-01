"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
describe("Tree-js", () => {
    it("should generate tree from array", () => {
        expect(new index_1.TreeJs([
            {
                id: "1",
                parentId: null,
                data: [1, 2, 3]
            },
            {
                id: "4",
                parentId: undefined
            },
            {
                id: "2",
                parentId: "1"
            },
            {
                id: 3,
                parentId: "4",
                value: 2
            }
        ]).getTree()).toEqual([
            {
                id: "1",
                parentId: null,
                data: [1, 2, 3],
                children: [
                    {
                        id: "2",
                        parentId: "1"
                    }
                ]
            },
            {
                id: "4",
                parentId: undefined,
                children: [
                    {
                        id: 3,
                        parentId: "4",
                        value: 2
                    }
                ]
            }
        ]);
    });
    it("should generate empty array", () => {
        expect(new index_1.TreeJs([]).getTree()).toEqual([]);
    });
    it("should find node from tree", () => {
        const tree = new index_1.TreeJs([
            {
                parentId: null,
                id: 1
            },
            {
                parentId: null,
                id: 2
            },
            {
                parentId: 1,
                id: 3
            },
            {
                parentId: 2,
                id: 4
            },
            {
                parentId: 3,
                id: 5,
                value: 2
            }
        ]);
        expect(tree.find((node) => node.id === 5)).toEqual({
            parentId: 3,
            id: 5,
            value: 2
        });
        expect(tree.find((node) => node.value === 2)).toEqual({
            parentId: 3,
            id: 5,
            value: 2
        });
        expect(tree.find((node) => node.foo === "")).toEqual(null);
        expect(tree.find((node) => node.id === 1)).toEqual({
            parentId: null,
            id: 1,
            children: [
                {
                    parentId: 1,
                    id: 3,
                    children: [
                        {
                            parentId: 3,
                            id: 5,
                            value: 2
                        }
                    ]
                }
            ]
        });
    });
    it("should find path from tree", () => {
        const tree = new index_1.TreeJs([
            {
                parentId: null,
                id: 1
            },
            {
                parentId: null,
                id: 2
            },
            {
                parentId: 1,
                id: 3
            },
            {
                parentId: 2,
                id: 4
            },
            {
                parentId: 3,
                id: 5,
                value: 2
            }
        ]);
        expect(tree.findPath((node) => node.id === 5)).toEqual([
            {
                parentId: null,
                id: 1
            },
            {
                parentId: 1,
                id: 3
            },
            {
                parentId: 3,
                id: 5,
                value: 2
            }
        ]);
        expect(tree.findPath((node) => node.id === 10)).toEqual(null);
        expect(tree.findPath((node) => node.id === 1)).toEqual([
            {
                parentId: null,
                id: 1
            }
        ]);
    });
});
//# sourceMappingURL=tree-js.spec.js.map