package tree_sitter_property_list_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_property_list "github.com/formkunft/tree-sitter-property-list/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_property_list.Language())
	if language == nil {
		t.Errorf("Error loading Property List grammar")
	}
}
