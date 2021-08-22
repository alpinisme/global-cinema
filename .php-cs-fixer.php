<?php

$finder = PhpCsFixer\Finder::create()
    ->exclude(['vendor', 'storage'])
    ->in(__DIR__);

return PhpCsFixer\Config::create()
    ->setRules([
        '@PSR2' => true,
        'align_multiline_comment' => true,
        'array_indentation' => true,
        'array_syntax' => ['syntax' => 'short'],
        'blank_line_before_statement' => true,
        'class_attributes_separation' => true,
        'combine_consecutive_unsets' => true,
        'method_separation' => true,
        'no_multiline_whitespace_before_semicolons' => true,
        'single_quote' => true,

        'binary_operator_spaces' => [
            'align_double_arrow' => false,
            'align_equals' => false,
        ],

        'braces' => [
            'allow_single_line_closure' => true,
        ],
        'concat_space' => ['spacing' => 'one'],
        'declare_equal_normalize' => true,
        'function_typehint_space' => true,
        'include' => true,
        'lowercase_cast' => true,
        'no_extra_consecutive_blank_lines' => [
            'curly_brace_block',
            'extra',
            'parenthesis_brace_block',
            'square_brace_block',
            'throw',
            'use',
        ],
        'no_multiline_whitespace_around_double_arrow' => true,
        'no_spaces_around_offset' => true,
        'no_whitespace_before_comma_in_array' => true,
        'no_whitespace_in_blank_line' => true,
        'object_operator_without_whitespace' => true,
        'single_blank_line_before_namespace' => true,
        'standardize_not_equals' => true,
        'ternary_operator_spaces' => true,
        'trailing_comma_in_multiline_array' => true,
        'no_trailing_comma_in_singleline_array' => true,
        'trim_array_spaces' => true,
        'unary_operator_spaces' => true,
        'whitespace_after_comma_in_array' => true,
    ])
    ->setFinder($finder);
