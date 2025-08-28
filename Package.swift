// swift-tools-version:5.3
import PackageDescription

let package = Package(
    name: "TreeSitterPropertyList",
    products: [
        .library(name: "TreeSitterPropertyList", targets: ["TreeSitterPropertyList"]),
    ],
    targets: [
        .target(
            name: "TreeSitterPropertyList",
            path: ".",
            sources: ["src/parser.c"],
            resources: [
                .copy("queries")
            ],
            publicHeadersPath: "bindings/swift",
            cSettings: [.headerSearchPath("src")]
        ),
    ],
    cLanguageStandard: .c11
)
