/*
 *
 * Wijmo Library 3.20143.59
 * http://wijmo.com/
 *
 * Copyright(c) GrapeCity, Inc.  All rights reserved.
 * 
 * Licensed under the Wijmo Commercial License. Also available under the GNU GPL Version 3 license.
 * licensing@wijmo.com
 * http://wijmo.com/widgets/license/
 *
 */
var wijmo;
(function (wijmo) {
    (function (input) {
        /** @ignore */
        var CharType = (function () {
            function CharType() {
                /// <summary>
                ///   Indicates that the character is not of a particular category.
                /// </summary>
                this.OtherChar = 0x0000;
                /// <summary>
                ///   Indicates that the character is a control code.
                /// </summary>
                this.Control = 0x0001;
                /// <summary>
                ///   Indicates that the character is a numeric digit.
                /// </summary>
                this.Numeric = 0x0002;
                /// <summary>
                ///   Indicates that the character is a mathematical symbol.
                /// </summary>
                this.MathSymbol = 0x0003;
                /// <summary>
                ///   Indicates that the character is a symbol.
                /// </summary>
                this.Symbol = 0x0004;
                /// <summary>
                ///   Indicates that the character is a punctuation. ( Open &amp; Close )
                /// </summary>
                this.Punctuation = 0x0005;
                /// <summary>
                ///   Indicates that the character is a space character.
                /// </summary>
                this.Space = 0x0006;
                /// <summary>
                ///   Indicates that the character is an upper case letter.
                /// </summary>
                this.UpperCase = 0x0007;
                /// <summary>
                ///   Indicates that the character is a lower case letter.
                /// </summary>
                this.LowerCase = 0x0008;
                /// <summary>
                ///   Indicates that the character is a Japanese Katakana character.
                /// </summary>
                this.Katakana = 0x0009;
                /// <summary>
                ///   Indicates that the character is a Japanese Hiragana character.
                /// </summary>
                this.Hiragana = 0x000a;
                /// <summary>
                ///   Indicates that the character is a CJK punctuation.
                /// </summary>
                this.FarEastPunctation = 0x000b;
                /// <summary>
                ///   Indicates that the character is a Hangal character.
                /// </summary>
                this.Hangul = 0x000c;
                /// <summary>
                ///   Indicates that the character is of full width.
                /// </summary>
                this.FullWidth = 0x8000;
            }
            return CharType;
        })();
        input.CharType = CharType;

        /** @ignore */
        var CharCategory = (function () {
            function CharCategory() {
                // Min & Max values ----------------------------------
                ///   Represents the smallest possible value of a Char.
                ///   This field is constant.
                this.MinValue = '\u0000';
                ///   Represents the largest possible value of a Char.
                ///   This field is constant.
                this.MaxValue = '\uffff';
                //Full/HalfWidth characters (different cultures)------
                this.ANSISTART = 0x0000;
                this.ANSIEND = 0x00ff;
                this.BOTHWIDTHSTART = 0xff00;
                this.BOTHWIDTHEND = 0xffef;
                this.FULLALPHASTART = 0xff01;
                this.FULLUPPERSTART = 0xff21;
                this.FULLUPPEREND = 0xff3a;
                this.FULLALPHAEND = 0xff5e;
                this.CJKHALFSYMBOLSTART = 0xff61;
                this.CJKHALFSYMBOLEND = 0xff64;
                this.KANAHALFSTART = 0xff65;
                this.KANAHALFEND = 0xff9f;
                this.HANGULHALFSTART = 0xffa0;
                this.HANGULHALFEND = 0xffdc;
                this.FULLSYMBOLSTART = 0xffe0;
                this.FULLSYMBOLEND = 0xffe6;
                this.HALFPUNCTSTART = 0xffe8;
                this.HALFPUNCTEND = 0xffee;
                // Voiced characters (Japanese)------------------------
                this.KATAKANA_VOICED = '\uff9e';
                this.KATAKANA_SEMIVOICED = '\uff9f';
                //Others-----------------------------------------------
                this.Tab = '\u0009';
                this.Space = '\u0020';
                //>>> Static Data (tables) ----------------------------
                // Character Groups...
                ///   Character groups (character codes) based on Unicode 3.1.
                this._charstarts = [
                    '\u0000',
                    '\u0080',
                    '\u0100',
                    '\u0180',
                    '\u0250',
                    '\u02b0',
                    '\u0300',
                    '\u0370',
                    '\u0400',
                    '\u0530',
                    '\u0590',
                    '\u0600',
                    '\u0700',
                    '\u0780',
                    '\u0900',
                    '\u0980',
                    '\u0a00',
                    '\u0a80',
                    '\u0b00',
                    '\u0b80',
                    '\u0c00',
                    '\u0c80',
                    '\u0d00',
                    '\u0d80',
                    '\u0e00',
                    '\u0e80',
                    '\u0f00',
                    '\u1000',
                    '\u10a0',
                    '\u1100',
                    '\u1200',
                    '\u13a0',
                    '\u1400',
                    '\u1680',
                    '\u16a0',
                    '\u1780',
                    '\u1800',
                    '\u1e00',
                    '\u1f00',
                    '\u2000',
                    '\u2070',
                    '\u20a0',
                    '\u20d0',
                    '\u2100',
                    '\u2150',
                    '\u2190',
                    '\u2200',
                    '\u2300',
                    '\u2400',
                    '\u2440',
                    '\u2460',
                    '\u2500',
                    '\u2580',
                    '\u25a0',
                    '\u2600',
                    '\u2700',
                    '\u2800',
                    '\u2e80',
                    '\u2f00',
                    '\u2ff0',
                    '\u3000',
                    '\u3040',
                    '\u30a0',
                    '\u3100',
                    '\u3130',
                    '\u3190',
                    '\u31a0',
                    '\u3200',
                    '\u3300',
                    '\u3400',
                    '\u4e00',
                    '\ua000',
                    '\ua490',
                    '\uac00',
                    '\uf900',
                    '\ufb00',
                    '\ufb50',
                    '\ufe20',
                    '\ufe30',
                    '\ufe50',
                    '\ufe70',
                    '\uff00',
                    '\ufff0'
                ];
                //Character Block Categories...
                ///   Character blocks categorized base on the Unicode standard.
                this.Blocks = [
                    'BASIC_LATIN',
                    'LATIN_1_SUPPLEMENT',
                    'LATIN_EXTENDED_A',
                    'LATIN_EXTENDED_B',
                    'IPA_EXTENSIONS',
                    'SPACING_MODIFIER_LETTERS',
                    'COMBINING_DIACRITICAL_MARKS',
                    'GREEK',
                    'CYRILLIC',
                    'ARMENIAN',
                    'HEBREW',
                    'ARABIC',
                    'SYRIAC',
                    'THAANA',
                    'DEVANAGARI',
                    'BENGALI',
                    'GURMUKHI',
                    'GUJARATI',
                    'ORIYA',
                    'TAMIL',
                    'TELUGU',
                    'KANNADA',
                    'MALAYALAM',
                    'SINHALA',
                    'THAI',
                    'LAO',
                    'TIBETAN',
                    'MYANMAR',
                    'GEORGIAN',
                    'HANGUL_JAMO',
                    'ETHIOPIC',
                    'CHEROKEE',
                    'UNIFIED_CANADIAN_ABORIGINAL_SYLLABIC',
                    'OGHAM',
                    'RUNIC',
                    'KUMER',
                    'MONGOLIAN',
                    'LATIN_EXTENDED_ADDITIONAL',
                    'GREEK_EXTENDED',
                    'GENERAL_PUNCTUATION',
                    'SUPERSCRIPTS_AND_SUBSCRIPTS',
                    'CURRENCY_SYMBOLS',
                    'COMBINING_MARKS_FOR_SYMBOLS',
                    'LETTERLIKE_SYMBOLS',
                    'NUMBER_FORMS',
                    'ARROWS',
                    'MATHEMATICAL_OPERATORS',
                    'MISCELLANEOUS_TECHNICAL',
                    'CONTROL_PICTURES',
                    'OPTICAL_CHARACTER_RECOGNITION',
                    'ENCLOSED_ALPHANUMERICS',
                    'BOX_DRAWING',
                    'BLOCK_ELEMENTS',
                    'GEOMETRIC_SHAPES',
                    'MISCELLANEOUS_SYMBOLS',
                    'DINGBATS',
                    'BRAILLE_PATTERNS',
                    'CJK_RADICALS_SUPPLEMENT',
                    'KANGXI_RADICALS',
                    'IDEOGRAPHIC_DESCRIPTION_CHARACTERS',
                    'CJK_SYMBOLS_AND_PUNCTUATION',
                    'HIRAGANA',
                    'KATAKANA',
                    'BOPOMOFO',
                    'HANGUL_COMPATIBILITY_JAMO',
                    'KANBUN',
                    'BOPOMOFO_EXTENDED',
                    'ENCLOSED_CJK_LETTERS_AND_MONTHS',
                    'CJK_COMPATIBILITY',
                    'CJK_UNIFIED_IDEOGRAPHS_EXTENSION',
                    'CJK_UNIFIED_IDEOGRAPHS',
                    'YI_SYLLABLES',
                    'YI_RADICALS',
                    'HANGUL_SYLLABLES',
                    'CJK_COMPATIBILITY_IDEOGRAPHS',
                    'ALPHABETIC_PRESENTATION_FORMS',
                    'ARABIC_PRESENTATION_FORMS_A',
                    'COMBINING_HALF_MARKS',
                    'CJK_COMPATIBILITY_FORMS',
                    'SMALL_FORM_VARIANTS',
                    'ARABIC_PRESENTATION_FORMS_B',
                    'HALFWIDTH_AND_FULLWIDTH_FORMS',
                    'SPECIALS'
                ];
                // Multi width character block mapping table...
                ///   Table of multi-width character blocks.
                this._fullhalfblocks = [
                    '\uff01',
                    '\uff10',
                    '\uff1a',
                    '\uff21',
                    '\uff3b',
                    '\uff41',
                    '\uff5b',
                    '\uff61',
                    '\uff65',
                    '\uffa0',
                    '\uffe0',
                    '\uffe8'
                ];
                // Half width Katakana map table...
                ///   Mapping table of full width Katakana.
                this._halfkana = [
                    '\u30fb', '\u30f2',
                    '\u30a1', '\u30a3', '\u30a5', '\u30a7', '\u30a9',
                    '\u30e3', '\u30e5', '\u30e7',
                    '\u30c3', '\u30fc',
                    '\u30a2', '\u30a4', '\u30a6', '\u30a8', '\u30aa',
                    '\u30ab', '\u30ad', '\u30af', '\u30b1', '\u30b3',
                    '\u30b5', '\u30b7', '\u30b9', '\u30bb', '\u30bd',
                    '\u30bf', '\u30c1', '\u30c4', '\u30c6', '\u30c8',
                    '\u30ca', '\u30cb', '\u30cc', '\u30cd', '\u30ce',
                    '\u30cf', '\u30d2', '\u30d5', '\u30d8', '\u30db',
                    '\u30de', '\u30df', '\u30e0', '\u30e1', '\u30e2',
                    '\u30e4', '\u30e6', '\u30e8',
                    '\u30e9', '\u30ea', '\u30eb', '\u30ec', '\u30ed',
                    '\u30ef', '\u30f3',
                    '\u3099', '\u309a'
                ];
                // Full width Katakana map table...
                ///   Mapping table of half-width Katakana.
                this._fullkana = [
                    '\uff67', '\uff71', '\uff68', '\uff72', '\uff69', '\uff73',
                    '\uff6a', '\uff74', '\uff6b', '\uff75',
                    '\uff76', '\uff76', '\uff77', '\uff77', '\uff78', '\uff78',
                    '\uff79', '\uff79', '\uff7a', '\uff7a',
                    '\uff7b', '\uff7b', '\uff7c', '\uff7c', '\uff7d', '\uff7d',
                    '\uff7e', '\uff7e', '\uff7f', '\uff7f',
                    '\uff80', '\uff80', '\uff81', '\uff81', '\uff6f', '\uff82',
                    '\uff82', '\uff83', '\uff83', '\uff84', '\uff84',
                    '\uff85', '\uff86', '\uff87', '\uff88', '\uff89',
                    '\uff8a', '\uff8a', '\uff8a', '\uff8b', '\uff8b', '\uff8b',
                    '\uff8c', '\uff8c', '\uff8c', '\uff8d', '\uff8d', '\uff8d',
                    '\uff8e', '\uff8e', '\uff8e',
                    '\uff8f', '\uff90', '\uff91', '\uff92', '\uff93',
                    '\uff6c', '\uff94', '\uff6d', '\uff95', '\uff6e', '\uff96',
                    '\uff97', '\uff98', '\uff99', '\uff9a', '\uff9b',
                    '\uff9c', '\uff9c', '\uff68', '\uff6a', '\uff66', '\uff9d',
                    '\uff73', '\uff76', '\uff79', '\uff9c', '\uff68', '\uff6a',
                    '\uff66',
                    '\uff65', '\uff70'
                ];
                this._fullkanaSmall = [
                    '\uff67', '\uff68', '\uff69', '\uff6a', '\uff6b',
                    '\uff6c', '\uff6d', '\uff6e', '\uff6f'
                ];
                // Voiced (accent) map table (Japanese)...
                ///   Mapping table for accents for the Japanese language.
                this._accentkana = [
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    -1, 1, -1, 1, -1, 1, -1, 1, -1, 1,
                    -1, 1, -1, 1, -1, 1, -1, 1, -1, 1,
                    -1, 1, -1, 1, 0, -1, 1, -1, 1, -1, 1,
                    0, 0, 0, 0, 0,
                    -3, 1, 2, -3, 1, 2, -3, 1, 2, -3, 1, 2, -3, 1, 2,
                    0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0,
                    1, 0, 0, 1, 1, 1,
                    1,
                    0, 0
                ];
                // Special quotations for FarEast...
                this._feQuotes = ['\u2018', '\u2019', '\u201c', '\u201d'];
                // Katakana & Hiragana mixed characters (Japanese)...
                this._jpnMixed = ['\u30fc'];
                // Full / Half width special character map table...
                this._jpnSpecialFull = [
                    '\u3000',
                    '\u3001',
                    '\u3002',
                    '\u300c',
                    '\u300d',
                    '\u201c',
                    '\u201d',
                    '\u2018',
                    '\u2019',
                    '\u309b',
                    '\u309c',
                    '\uffe5'
                ];
                this._jpnSpecialHalf = [
                    '\u0020',
                    '\uff64',
                    '\uff61',
                    '\uff62',
                    '\uff63',
                    '\u0022',
                    '\u0022',
                    '\u0027',
                    '\u0027',
                    '\uff9e',
                    '\uff9f',
                    '\u00a5'
                ];
                var _charType = new CharType();
                this._mwtable = [
                    _charType.Symbol | _charType.FullWidth,
                    _charType.Numeric | _charType.FullWidth,
                    _charType.Symbol | _charType.FullWidth,
                    _charType.UpperCase | _charType.FullWidth,
                    _charType.Symbol | _charType.FullWidth,
                    _charType.LowerCase | _charType.FullWidth,
                    _charType.Symbol | _charType.FullWidth,
                    _charType.FarEastPunctation,
                    _charType.Katakana,
                    _charType.Hangul,
                    _charType.Symbol | _charType.FullWidth,
                    _charType.Symbol
                ];
            }
            return CharCategory;
        })();
        input.CharCategory = CharCategory;

        /** @ignore */
        var CharProcess = (function () {
            function CharProcess() {
                this.CharCategory = new CharCategory();
                this.Ctype = new CharType();
            }
            CharProcess.prototype.ToHalfKatakana = function (c) {
                var result = "";
                if (this.IsFullWidth(c)) {
                    if (this.IsKatakana(c)) {
                        var katakana = c;
                        var n = katakana.charCodeAt(0) - (this.CharCategory._charstarts[62].charCodeAt(0) + 1);
                        if (n < 0 || n > 91) {
                            return katakana;
                        }
                        katakana = this.CharCategory._fullkana[n];

                        var accent = this.CharCategory._accentkana[n];

                        if (accent > 0) {
                            //accent == 1 ? this.CharCategory.KATAKANA_VOICED.charCodeAt(0) : this.CharCategory.KATAKANA_SEMIVOICED.charCodeAt(0) ;
                            katakana = katakana + String.fromCharCode(accent == 1 ? this.CharCategory.KATAKANA_VOICED.charCodeAt(0) : this.CharCategory.KATAKANA_SEMIVOICED.charCodeAt(0));
                        }
                        result = katakana;
                    } else if (this.IsHiragana(c)) {
                        var katakana = String.fromCharCode(c.charCodeAt(0) - this.CharCategory._charstarts[61].charCodeAt(0) + this.CharCategory._charstarts[62].charCodeAt(0));
                        var n = katakana.charCodeAt(0) - (this.CharCategory._charstarts[62].charCodeAt(0) + 1);
                        if (n < 0 || n > 91) {
                            return katakana;
                        }
                        katakana = this.CharCategory._fullkana[n];

                        var accent = this.CharCategory._accentkana[n];

                        if (accent > 0) {
                            //accent == 1 ? this.CharCategory.KATAKANA_VOICED.charCodeAt(0) : this.CharCategory.KATAKANA_SEMIVOICED.charCodeAt(0) ;
                            katakana = katakana + String.fromCharCode(accent == 1 ? this.CharCategory.KATAKANA_VOICED.charCodeAt(0) : this.CharCategory.KATAKANA_SEMIVOICED.charCodeAt(0));
                        }
                        result = katakana;
                    }
                } else {
                    if (this.IsKatakana(c)) {
                        result = c;
                    }
                }

                return result;
            };

            CharProcess.prototype.GetCharType = function (c) {
                var ctype = this.Ctype.OtherChar;
                var block = this.BelongTo(c);

                if (c == '\u007f' || ('\u0000' <= c && c <= '\u001f') || ('\u0080' <= c && c <= '\u009f'))
                    return this.Ctype.Control;

                if ('A' <= c && c <= 'Z')
                    return this.Ctype.UpperCase;

                if ('a' <= c && c <= 'z')
                    return this.Ctype.LowerCase;

                if ('0' <= c && c <= '9')
                    return this.Ctype.Numeric;

                //modified by sj
                //the logic that charex call textfilter is wrong
                //	var tFilter = new TextFilter(true,true,"");
                //	if (tFilter.IsSymbol(c))
                //	{
                //		ctype = this.Ctype.Symbol;
                //	}
                if (this.IsFullWidthSymbol(c) || this.IsHalfWidthSymbol(c)) {
                    ctype = this.Ctype.Symbol;
                }

                //end by sj
                if (c.charCodeAt(0) == 8216 || c.charCodeAt(0) == 8217 || c.charCodeAt(0) == 8220 || c.charCodeAt(0) == 8221)
                    ctype = this.Ctype.Punctuation;

                if (c.charCodeAt(0) == 12288)
                    ctype = this.Ctype.Space;

                switch (this.CharCategory.Blocks[block]) {
                    case 'HALFWIDTH_AND_FULLWIDTH_FORMS':
                        return this.MultiWidthDetails(c);
                    case 'KATAKANA':
                        return this.Ctype.Katakana | this.Ctype.FullWidth;
                    case 'HIRAGANA':
                        return this.Ctype.Hiragana | this.Ctype.FullWidth;
                }

                if (this.IsFarEastBlock(block, c))
                    ctype |= this.Ctype.FullWidth;

                return ctype;
            };

            CharProcess.prototype.IsCharOfType = function (c, type) {
                return this.GetCharType(c) == type;
            };

            CharProcess.prototype.IsMultiWidth = function (c) {
                var block = this.BelongTo(c);
                var category = this.CharCategory.Blocks[block];
                return (category == 'KATAKANA' || category == 'CJK_SYMBOLS_AND_PUNCTUATION' || category == 'HALFWIDTH_AND_FULLWIDTH_FORMS' || (category == 'BASIC_LATIN' && c >= '\u0020'));
            };

            CharProcess.prototype.IsFullWidthSymbol = function (c) {
                for (var i = 0; i < CharProcess.FullWidthSymbolArray.length; i++) {
                    if (c === CharProcess.FullWidthSymbolArray[i]) {
                        return true;
                    }
                }
                return false;
            };

            CharProcess.prototype.IsHalfWidthSymbol = function (c) {
                for (var i = 0; i < CharProcess.HalfWidthSymbolArray.length; i++) {
                    if (c === CharProcess.HalfWidthSymbolArray[i]) {
                        return true;
                    }
                }
                return false;
            };

            CharProcess.prototype.IsFullWidth = function (c) {
                if (this.IsFullWidthSymbol(c)) {
                    return true;
                }

                if (this.IsHalfWidthSymbol(c)) {
                    return false;
                }

                var block = this.BelongTo(c);

                var bFullWidth = this.IsFarEastBlock(block, c);
                if (this.CharCategory.Blocks[block] == 'HALFWIDTH_AND_FULLWIDTH_FORMS')
                    bFullWidth = ((this.MultiWidthDetails(c) & this.Ctype.FullWidth) == this.Ctype.FullWidth);

                return bFullWidth;
            };

            CharProcess.prototype.IsSurrogatePair = function (c) {
                if (c.charCodeAt(0) >= '\uD800'.charCodeAt(0) && c.charCodeAt(0) <= '\uDBFF'.charCodeAt(0) && c.charCodeAt(1) >= '\uDC00'.charCodeAt(0) && c.charCodeAt(1) <= '\uDFFF'.charCodeAt(0)) {
                    return true;
                }

                return false;
            };

            CharProcess.prototype.IsSurrogate = function (c) {
                return c != null && ((c.charCodeAt(0) >= '\uD800'.charCodeAt(0)) && c.charCodeAt(0) <= '\uDFFF'.charCodeAt(0));
            };

            CharProcess.prototype.IsOther = function (c) {
                return ((this.GetCharType(c) & ~this.Ctype.FullWidth) == this.Ctype.OtherChar);
            };

            CharProcess.prototype.IsControl = function (c) {
                return ((this.GetCharType(c) & ~this.Ctype.FullWidth) == this.Ctype.Control);
            };

            CharProcess.prototype.IsKatakana = function (c) {
                return ((this.GetCharType(c) & ~this.Ctype.FullWidth) == this.Ctype.Katakana);
            };

            CharProcess.prototype.IsSmallHalfKatakana = function (c) {
                var _halfkanaSmall = new Array('\u30a1', '\u30a3', '\u30a5', '\u30a7', '\u30a9', '\u30e3', '\u30e5', '\u30e7', '\u30c3', '\u30ee');

                var c1 = c;
                if (c.charCodeAt(0) > this.CharCategory.KANAHALFSTART) {
                    c1 = this.CharCategory._halfkana[c.charCodeAt(0) - this.CharCategory.KANAHALFSTART];
                }
                for (var i = 0; i < _halfkanaSmall.length; i++) {
                    if (c1 == _halfkanaSmall[i]) {
                        return true;
                    }
                }
                return false;
            };

            CharProcess.prototype.IsHiragana = function (c) {
                return (((this.GetCharType(c) & ~this.Ctype.FullWidth) == this.Ctype.Hiragana) || (this.CharCategory._jpnMixed[0] == c));
                //--------------------------------------------------------------------------------------------------
            };

            CharProcess.prototype.IsShiftJIS = function (c) {
                //var unicode = c.charCodeAt(0);
                //var offset = Math.floor(unicode / 8);
                //var mod = unicode % 8;
                //var flagString = CharProcess.ShiftJISCode.substr(offset * 2, 2);
                //var binaryString = parseInt(flagString, 16).toString(2);
                //while (binaryString.length < 8)
                //{
                //    binaryString = "0" + binaryString;
                //}
                //if (binaryString.substr(mod, 1) == "1")
                //{
                //    return true;
                //}
                return false;
            };

            CharProcess.prototype.IsJISX0208 = function (c) {
                //var unicode = c.charCodeAt(0);
                //var offset = Math.floor(unicode / 8);
                //var mod = unicode % 8;
                //var flagString = CharProcess.JISX0208Code.substr(offset * 2, 2);
                //var binaryString = parseInt(flagString, 16).toString(2);
                //while (binaryString.length < 8)
                //{
                //    binaryString = "0" + binaryString;
                //}
                //if (binaryString.substr(mod, 1) == "1")
                //{
                //    return true;
                //}
                return false;
            };

            CharProcess.prototype.IsDigit = function (c) {
                return ((this.GetCharType(c) & ~this.Ctype.FullWidth) == this.Ctype.Numeric);
            };

            CharProcess.prototype.IsPunctuation = function (c) {
                return ((this.GetCharType(c) & ~this.Ctype.FullWidth) == this.Ctype.Punctuation);
            };

            CharProcess.prototype.IsMathSymbol = function (c) {
                return ((this.GetCharType(c) & ~this.Ctype.FullWidth) == this.Ctype.MathSymbol);
            };

            CharProcess.prototype.IsSymbol = function (c) {
                return ((this.GetCharType(c) & ~this.Ctype.FullWidth) == this.Ctype.Symbol);
            };

            CharProcess.prototype.IsLower = function (c) {
                return ((this.GetCharType(c) & ~this.Ctype.FullWidth) == this.Ctype.LowerCase);
            };

            CharProcess.prototype.IsUpper = function (c) {
                return ((this.GetCharType(c) & ~this.Ctype.FullWidth) == this.Ctype.UpperCase);
            };

            CharProcess.prototype.IsDigitOrSymbol = function (c) {
                return (this.IsDigit(c) || this.IsMathSymbol(c));
            };

            CharProcess.prototype.IsAlphabet = function (c) {
                return (this.IsUpper(c) || this.IsLower(c));
            };

            CharProcess.prototype.IsAlphaOrDigit = function (c) {
                return (this.IsUpper(c) || this.IsLower(c) || this.IsDigit(c));
            };

            CharProcess.prototype.IsUpperKana = function (c) {
                return !this.IsLowerKana(c);
            };

            CharProcess.prototype.IsLowerKana = function (c) {
                return (CharProcess.LowerKana.search(c) != -1);
            };

            CharProcess.prototype.HasLowerKana = function (c) {
                return (CharProcess.UpperKana.search(c) != -1 || this.IsLowerKana(c));
            };

            CharProcess.prototype.ToUpperKana = function (c) {
                var index = CharProcess.LowerKana.search(c);
                return (index == -1) ? c : CharProcess.UpperKana.substr(index, 1);
            };

            CharProcess.prototype.ToLowerKana = function (c) {
                var index = CharProcess.UpperKana.search(c);
                if (index >= CharProcess.UpperKana.length - 4 && index < CharProcess.UpperKana.length) {
                    return c;
                }

                return (index == -1) ? c : CharProcess.LowerKana.substr(index, 1);
            };

            CharProcess.prototype.ToLower = function (c) {
                if (this.IsUpper(c))
                    return String.fromCharCode(c.charCodeAt(0) + 32);
                return c;
            };

            CharProcess.prototype.ToUpper = function (c) {
                if (this.IsLower(c))
                    return String.fromCharCode(c.charCodeAt(0) - 32);
                return c;
            };

            CharProcess.prototype.IsSpace = function (c) {
                return c == '\u0020' || c === '\u3000';
            };

            CharProcess.prototype.ToFullWidth = function (c) {
                var retObj = { text: "", processedAll: false };
                retObj.text = c;
                retObj.processedAll = false;

                if (c.length == 0)
                    return retObj;

                var c1 = c.substring(0, 1);

                if (this.IsMultiWidth(c1)) {
                    //
                    // Latin basic characters can be directly converted
                    // by making a few shifts...
                    //
                    if (c1 < this.CharCategory._charstarts[1]) {
                        //
                        // Funny why 'space' was left out of this category.
                        //
                        if (c1 == '\u0020') {
                            retObj.text = '\u3000';
                            return retObj;
                        }
                        var temp = '\u0021';
                        retObj.text = String.fromCharCode(c1.charCodeAt(0) - temp.charCodeAt(0) + (this.CharCategory._charstarts[81].charCodeAt(0) + 1)); //Blocks.HALFWIDTH_AND_FULLWIDTH_FORMS
                        return retObj;
                    }

                    //
                    //- pickup a direct map from the table...
                    //
                    if ((this.MultiWidthDetails(c1) & this.Ctype.Katakana) == this.Ctype.Katakana) {
                        if (c1.charCodeAt(0) < this.CharCategory.KANAHALFSTART) {
                            var c2 = this.GetFullHalfWidthSpecialChar(c1, true);
                            retObj.text = (c2 !== "") ? c2 : c1;
                            return retObj;
                        }
                        c1 = this.CharCategory._halfkana[c1.charCodeAt(0) - this.CharCategory.KANAHALFSTART];

                        //
                        // Handle the soundex here....
                        //
                        if (c.length < 2) {
                            retObj.text = c1;
                            return retObj;
                        }

                        var daku = c.charCodeAt(1) - (this.CharCategory.KATAKANA_VOICED.charCodeAt(0) - 1);
                        if (daku == 1 || daku == 2) {
                            retObj.processedAll = true;

                            var accent = this.CharCategory._accentkana[(c1.charCodeAt(0) - (this.CharCategory._charstarts[62].charCodeAt(0) + 1))];

                            if (accent != 0) {
                                if ((Math.abs(accent) & 2) == daku)
                                    c1 = String.fromCharCode(c1.charCodeAt(0) + 1);
                                c1 = String.fromCharCode(c1.charCodeAt(0) + 1);
                            }
                        }

                        //add by sj for bug 2955
                        if (daku == 1 && c1 == '\u30A6') {
                            c1 = '\u30F4';
                        }
                        //end by sj
                    }
                }
                retObj.text = c1;
                return retObj;
                //return c1;
            };

            CharProcess.prototype.ToHalfWidth = function (c) {
                //
                // Need to return only the first character.
                //
                return this.ToHalfWidthEx(c);
            };

            CharProcess.prototype.ToHalfWidthEx = function (c) {
                var ctype = this.GetCharType(c);

                var multiWidth = this.IsMultiWidth(c);

                //
                // First filter out half width characters and characters that
                // are not of CJK groups.
                if ((ctype & this.Ctype.FullWidth) == this.Ctype.FullWidth) {
                    switch (ctype & ~this.Ctype.FullWidth) {
                        case this.Ctype.Punctuation:
                        case this.Ctype.UpperCase:
                        case this.Ctype.LowerCase:
                        case this.Ctype.Symbol:
                        case this.Ctype.Numeric:
                        case this.Ctype.MathSymbol:
                             {
                                var c1 = this.GetFullHalfWidthSpecialChar(c, false);
                                if (c1 !== "")
                                    c = c1;
                                else {
                                    if (multiWidth) {
                                        var temp = '\u0021';

                                        //c = (char)(( c - (_charstarts[(int)Blocks.HALFWIDTH_AND_FULLWIDTH_FORMS] + 1) ) + '\u0021');
                                        c = String.fromCharCode(c.charCodeAt(0) - (this.CharCategory._charstarts[81].charCodeAt(0) + 1) + temp.charCodeAt(0)); //Blocks.HALFWIDTH_AND_FULLWIDTH_FORMS
                                    }
                                }
                            }
                            break;

                        case this.Ctype.Katakana:
                             {
                                var n = c.charCodeAt(0) - (this.CharCategory._charstarts[62].charCodeAt(0) + 1);
                                if (n < 0 || n > 91) {
                                    return c;
                                }
                                c = this.CharCategory._fullkana[n];

                                var accent = this.CharCategory._accentkana[n];

                                if (accent > 0) {
                                    //accent == 1 ? this.CharCategory.KATAKANA_VOICED.charCodeAt(0) : this.CharCategory.KATAKANA_SEMIVOICED.charCodeAt(0) ;
                                    c = c + String.fromCharCode(accent == 1 ? this.CharCategory.KATAKANA_VOICED.charCodeAt(0) : this.CharCategory.KATAKANA_SEMIVOICED.charCodeAt(0));
                                    return c;
                                }
                                //return new char[] { c, accent == 1 ? KATAKANA_VOICED : KATAKANA_SEMIVOICED };
                            }
                            break;

                        case this.Ctype.Space:
                            c = '\u0020';
                            break;

                        case this.Ctype.Hangul:
                            break;
                    }
                }

                return c;
            };
            CharProcess.prototype.ToKatakana = function (c) {
                //
                // Simply return the character if it isn't a hiragana.
                //
                if (!this.IsCharOfType(c, this.Ctype.Hiragana | this.Ctype.FullWidth))
                    return c;

                //
                // Need to handle special characters here...
                //
                var c1 = this.GetFullHalfWidthSpecialChar(c, false);

                //			if( c == '\u309b' || c == '\u309c' )
                //				return (char)('\uff9e' + (c - '\u309b'));
                if (c1 !== "")
                    return c1;

                //return (char)( c - _charstarts[(int)Blocks.HIRAGANA] + _charstarts[(int)Blocks.KATAKANA] );
                return String.fromCharCode(c.charCodeAt(0) - this.CharCategory._charstarts[61].charCodeAt(0) + this.CharCategory._charstarts[62].charCodeAt(0));
            };

            CharProcess.prototype.ToHiragana = function (c) {
                //
                // Simply return the character if it isn't a hiragana.
                if (!this.IsKatakana(c))
                    return c;

                // Convert to fullwidth Katakana.
                if (!this.IsFullWidth(c))
                    c = this.ToFullWidth(c).text;

                //validate
                if (!this.IsCharOfType(c, this.Ctype.Katakana | this.Ctype.FullWidth))
                    return c;

                //
                // Some fullwidth Katakana characters can't be expressed in Hiragaga
                // so mask it out.
                //
                //modified by sj for NKOI-8C7E84AA2
                //if (c >= '\u30f6' && c <= '\u30ff')
                //	return c;
                if (c >= '\u30f7' && c <= '\u30ff')
                    return c;

                if (c == '\u30f5')
                    return '\u304b';
                if (c == '\u30f6')
                    return '\u3051';

                //end by sj
                //return (char)( c - _charstarts[(int)Blocks.KATAKANA] + _charstarts[(int)Blocks.HIRAGANA] );
                return String.fromCharCode(c.charCodeAt(0) + this.CharCategory._charstarts[61].charCodeAt(0) - this.CharCategory._charstarts[62].charCodeAt(0));
            };

            CharProcess.prototype.ToBigHalfKatakana = function (c) {
                if (!this.IsSmallHalfKatakana(c))
                    return c;

                var c1 = this.CharCategory._halfkana[c.charCodeAt(0) - this.CharCategory.KANAHALFSTART];
                c1 = String.fromCharCode(c1.charCodeAt(0) + 1);
                return c1;
            };

            CharProcess.prototype.BelongTo = function (c) {
                var bottom = 0;
                var top = 83;
                var current = top >> 1;

                while (top - bottom > 1) {
                    if (c >= this.CharCategory._charstarts[current])
                        bottom = current;
                    else
                        top = current;
                    current = (top + bottom) >> 1;
                }

                return current;
            };

            CharProcess.prototype.MultiWidthDetails = function (c) {
                var bottom = 0;
                var top = this.CharCategory._fullhalfblocks.length;
                var current = top >> 1;

                while (top - bottom > 1) {
                    if (c >= this.CharCategory._fullhalfblocks[current])
                        bottom = current;
                    else
                        top = current;
                    current = (top + bottom) >> 1;
                }
                return this.CharCategory._mwtable[current];
            };

            CharProcess.prototype.IsFarEastBlock = function (block, c) {
                switch (this.CharCategory.Blocks[block]) {
                    case 'CJK_COMPATIBILITY':
                    case 'CJK_COMPATIBILITY_FORMS':
                    case 'CJK_COMPATIBILITY_IDEOGRAPHS':
                    case 'CJK_RADICALS_SUPPLEMENT':
                    case 'CJK_SYMBOLS_AND_PUNCTUATION':
                    case 'CJK_UNIFIED_IDEOGRAPHS':
                    case 'CJK_UNIFIED_IDEOGRAPHS_EXTENSION':
                    case 'HALFWIDTH_AND_FULLWIDTH_FORMS':
                    case 'BOPOMOFO':
                    case 'BOPOMOFO_EXTENDED':
                    case 'HIRAGANA':
                    case 'KATAKANA':
                    case 'KANBUN':
                    case 'HANGUL_COMPATIBILITY_JAMO':
                    case 'HANGUL_JAMO':
                    case 'HANGUL_SYLLABLES':
                        return true;

                    default:
                        for (var i = 0; i < this.CharCategory._feQuotes.length; i++) {
                            if (c == this.CharCategory._feQuotes[i]) {
                                return true;
                            }
                        }

                        if (c.charCodeAt(0) > 255) {
                            return true;
                        }

                        if (c.charCodeAt(0) == 8216 || c.charCodeAt(0) == 8217 || c.charCodeAt(0) == 8220 || c.charCodeAt(0) == 8221)
                            return true;

                        break;
                }
                return false;
            };

            CharProcess.prototype.GetFullHalfWidthSpecialChar = function (c, toFull) {
                if (toFull == true) {
                    var srctable = this.CharCategory._jpnSpecialHalf;
                    var desttable = this.CharCategory._jpnSpecialFull;
                } else {
                    var srctable = this.CharCategory._jpnSpecialFull;
                    var desttable = this.CharCategory._jpnSpecialHalf;
                }

                var found = -1;
                var tempIndex = 0;
                while (tempIndex < srctable.length) {
                    if (srctable[tempIndex] == c) {
                        found = tempIndex;
                        break;
                    }
                    tempIndex++;
                }

                if (found != -1) {
                    if (tempIndex < desttable.length) {
                        return desttable[tempIndex];
                    }
                }
                return "";
            };
            CharProcess.LowerKana = "\u3041\u3043\u3045\u3047\u3049\u3063\u3083\u3085\u3087\u308e\u30a1\u30a3\u30a5\u30a7\u30a9\u30c3\u30e3\u30e5\u30e7\u30ee\uff67\uff68\uff69\uff6a\uff6b\uff6c\uff6d\uff6e\uff6f\u30F5\u30F6\u3095\u3096";
            CharProcess.UpperKana = "\u3042\u3044\u3046\u3048\u304a\u3064\u3084\u3086\u3088\u308f\u30a2\u30a4\u30a6\u30a8\u30aa\u30c4\u30e4\u30e6\u30e8\u30ef\uff71\uff72\uff73\uff74\uff75\uff94\uff95\uff96\uff82\u30AB\u30B1\u304B\u3051";

            CharProcess.FullWidthSymbolArray = [
                '\u3001',
                '\u3002',
                '\uFF0C',
                '\uFF0E',
                '\u30FB',
                '\uFF1A',
                '\uFF1B',
                '\uFF1F',
                '\uFF01',
                '\u309B',
                '\u309C',
                '\u00B4',
                '\uFF40',
                '\u00A8',
                '\uFF3E',
                '\uFFE3',
                '\uFF3F',
                '\u30FD',
                '\u30FE',
                '\u309D',
                '\u309E',
                '\u3003',
                '\u4EDD',
                '\u3005',
                '\u3006',
                '\u3007',
                '\u30FC',
                '\u2014',
                '\u2010',
                '\uFF0F',
                '\u301C',
                '\u2016',
                '\uFF5C',
                '\u2026',
                '\u2025',
                '\u2018',
                '\u2019',
                '\u201C',
                '\u201D',
                '\uFF08',
                '\uFF09',
                '\u3014',
                '\u3015',
                '\uFF3B',
                '\uFF3D',
                '\uFF5B',
                '\uFF5D',
                '\u3008',
                '\u3009',
                '\u300A',
                '\u300B',
                '\u300C',
                '\u300D',
                '\u300E',
                '\u300F',
                '\u3010',
                '\u3011',
                '\uFF0B',
                '\u2212',
                '\u00B1',
                '\u00D7',
                '\u00F7',
                '\uFF1D',
                '\u2260',
                '\uFF1C',
                '\uFF1E',
                '\u2266',
                '\u2267',
                '\u221E',
                '\u2234',
                '\u2642',
                '\u2640',
                '\u00B0',
                '\u2032',
                '\u2033',
                '\u2103',
                '\uFFE5',
                '\uFF04',
                '\u00A2',
                '\u00A3',
                '\uFF05',
                '\uFF03',
                '\uFF06',
                '\uFF0A',
                '\uFF20',
                '\u00A7',
                '\u2606',
                '\u2605',
                '\u25CB',
                '\u25CF',
                '\u25CE',
                '\u25C7',
                '\u25C6',
                '\u25A1',
                '\u25A0',
                '\u25B3',
                '\u25B2',
                '\u25BD',
                '\u25BC',
                '\u203B',
                '\u3012',
                '\u2192',
                '\u2190',
                '\u2191',
                '\u2193',
                '\u3013',
                '\uFF07',
                '\uFF02',
                '\uFF0D',
                '\u3033',
                '\u3034',
                '\u3035',
                '\u303B',
                '\u303C',
                '\u30FF',
                '\u309F',
                '\u2208',
                '\u220B',
                '\u2286',
                '\u2287',
                '\u2282',
                '\u2283',
                '\u222A',
                '\u2229',
                '\u2284',
                '\u2285',
                '\u228A',
                '\u228B',
                '\u2209',
                '\u2205',
                '\u2305',
                '\u2306',
                '\u2227',
                '\u2228',
                '\u00AC',
                '\u21D2',
                '\u21D4',
                '\u2200',
                '\u2203',
                '\u2295',
                '\u2296',
                '\u2297',
                '\u2225',
                '\u2226',
                '\u2985',
                '\u2986',
                '\u3018',
                '\u3019',
                '\u3016',
                '\u3017',
                '\u2220',
                '\u22A5',
                '\u2312',
                '\u2202',
                '\u2207',
                '\u2261',
                '\u2252',
                '\u226A',
                '\u226B',
                '\u221A',
                '\u223D',
                '\u221D',
                '\u2235',
                '\u222B',
                '\u222C',
                '\u2262',
                '\u2243',
                '\u2245',
                '\u2248',
                '\u2276',
                '\u2277',
                '\u2194',
                '\u212B',
                '\u2030',
                '\u266F',
                '\u266D',
                '\u266A',
                '\u2020',
                '\u2021',
                '\u00B6',
                '\u266E',
                '\u266B',
                '\u266C',
                '\u2669',
                '\u25EF',
                '\uFF3C',
                '\uFF5E',
                '\uFFE0',
                '\uFFE1',
                '\uFFE2',
                '\u2015'
            ];

            CharProcess.HalfWidthSymbolArray = [
                '\u005C',
                '\u007E',
                '\u0021',
                '\u0022',
                '\u0023',
                '\u0024',
                '\u0025',
                '\u0026',
                '\u0027',
                '\u0028',
                '\u0029',
                '\u002A',
                '\u002B',
                '\u002C',
                '\u002D',
                '\u002E',
                '\u002F',
                '\u003A',
                '\u003B',
                '\u003C',
                '\u003D',
                '\u003E',
                '\u003F',
                '\u0040',
                '\u005B',
                '\u005D',
                '\u005E',
                '\u005F',
                '\u0060',
                '\u007B',
                '\u007C',
                '\u007D',
                '\uFF61',
                '\uFF62',
                '\uFF63',
                '\uFF64',
                '\uFF65',
                '\u00A1',
                '\u00A4',
                '\u00A5'
            ];

            CharProcess.CharEx = new CharProcess();
            return CharProcess;
        })();
        input.CharProcess = CharProcess;
    })(wijmo.input || (wijmo.input = {}));
    var input = wijmo.input;
})(wijmo || (wijmo = {}));
