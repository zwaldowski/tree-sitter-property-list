/**
 * @file Property List grammar for tree-sitter. This grammar covers the OpenStep-style property list format, also known as NeXTSTEP-style, old-style, or ASCII plist format.
 * @author Florian Pircher <florian@formkunft.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "property_list",

  extras: $ => [
    $.comment,
    /\s/,
    /\u2028/,
    /\u2029/,
  ],

  rules: {
    source_file: $ => optional($._value),

    _value: $ => choice(
      $.array,
      $.dictionary,
      $.number,
      $.string,
      $.data,
    ),

    array: $ => seq(
      '(',
      optional(seq(
        $._value,
        repeat(seq(',', $._value)),
        optional(','),
      )),
      ')',
    ),

    dictionary: $ => seq(
      '{',
      repeat($.dictionary_entry),
      '}',
    ),

    dictionary_entry: $ => seq(
      field('key', $.string),
      '=',
      field('value', $._value),
      ';',
    ),

    string: $ => choice(
      $.quoted_string,
      $.single_quoted_string,
      $.unquoted_string,
    ),

    quoted_string: $ => seq(
      '"',
      repeat(prec(1, choice(
        $.escape_sequence,
        token.immediate(prec(1, /[^"\\]/)),
      ))),
      '"',
    ),

    single_quoted_string: $ => seq(
      "'",
      repeat(prec(1, choice(
        $.escape_sequence,
        token.immediate(prec(1, /[^'\\]/)),
      ))),
      "'",
    ),

    unquoted_string: $ => token(choice(
      // must start with non-digit characters
      /[a-zA-Z.\/:_$+][a-zA-Z0-9\-.\/:_$+]*/,
      // numbers followed by non-numeric characters
      /[0-9]+[a-zA-Z\-\/:_$+][a-zA-Z0-9\-.\/:_$+]*/,
    )),

    number: $ => token(/-?[0-9]+(?:\.[0-9]+)?/),

    escape_sequence: $ => token.immediate(seq(
      '\\',
      choice(
        // standard escape sequences
        /[\\abefnrtv]/,
        // literal newline
        '\n',
        // octal sequences: \123
        /[0-7]{1,3}/,
        // unicode sequences: \U1234
        seq('U', /[0-9A-Fa-f]{4}/),
        // literal
        /./,
      ),
    )),

    data: $ => seq(
      '<',
      repeat($.byte),
      '>',
    ),

    byte: $ => /[0-9A-Fa-f]{2}/,

    comment: $ => choice(
      $.line_comment,
      $.block_comment,
    ),

    line_comment: $ => token(seq(
      '//',
      /[^\r\n\u2028\u2029]*/,
    )),

    block_comment: $ => token(seq(
      '/*',
      repeat(choice(
        /[^*]/,
        seq('*', /[^/]/),
      )),
      '*/'
    )),
  },
});
