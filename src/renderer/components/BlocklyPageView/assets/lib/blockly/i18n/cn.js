/* eslint-disable max-len */
function initBlocklyMsg(Blockly) {
  Blockly.Msg.ADD_COMMENT = '添加描述';
  Blockly.Msg.CHANGE_VALUE_TITLE = '修改值：';
  Blockly.Msg.CLEAN_UP = '清除所有命令';
  Blockly.Msg.COLLAPSE_ALL = '折叠命令';
  Blockly.Msg.COLLAPSE_BLOCK = '折叠命令';
  Blockly.Msg.COLOUR_BLEND_COLOUR1 = 'colour 1';
  Blockly.Msg.COLOUR_BLEND_COLOUR2 = 'colour 2';
  Blockly.Msg.COLOUR_BLEND_HELPURL = 'http://meyerweb.com/eric/tools/color-blend/';
  Blockly.Msg.COLOUR_BLEND_RATIO = 'ratio';
  Blockly.Msg.COLOUR_BLEND_TITLE = 'blend';
  Blockly.Msg.COLOUR_BLEND_TOOLTIP = 'Blends two colours together with a given ratio (0.0 - 1.0).';
  Blockly.Msg.COLOUR_PICKER_HELPURL = 'https://en.wikipedia.org/wiki/Color';
  Blockly.Msg.COLOUR_PICKER_TOOLTIP = 'Choose a colour from the palette.';
  Blockly.Msg.COLOUR_RANDOM_HELPURL = 'http://randomcolour.com';
  Blockly.Msg.COLOUR_RANDOM_TITLE = 'random colour';
  Blockly.Msg.COLOUR_RANDOM_TOOLTIP = 'Choose a colour at random.';
  Blockly.Msg.COLOUR_RGB_BLUE = 'blue';
  Blockly.Msg.COLOUR_RGB_GREEN = 'green';
  Blockly.Msg.COLOUR_RGB_HELPURL = 'http://www.december.com/html/spec/colorper.html';
  Blockly.Msg.COLOUR_RGB_RED = 'red';
  Blockly.Msg.COLOUR_RGB_TITLE = 'colour with';
  Blockly.Msg.COLOUR_RGB_TOOLTIP = 'Create a colour with the specified amount of red, green, and blue. All values must be between 0 and 100.';
  Blockly.Msg.CONTROLS_FLOW_STATEMENTS_HELPURL = 'https://github.com/google/blockly/wiki/Loops#loop-termination-blocks';
  Blockly.Msg.CONTROLS_FLOW_STATEMENTS_OPERATOR_BREAK = '终止循环';
  Blockly.Msg.CONTROLS_FLOW_STATEMENTS_OPERATOR_CONTINUE = '开始';
  Blockly.Msg.CONTROLS_FLOW_STATEMENTS_TOOLTIP_BREAK = 'Break out of the containing loop.';
  Blockly.Msg.CONTROLS_FLOW_STATEMENTS_TOOLTIP_CONTINUE = 'Skip the rest of this loop, and continue with the next iteration.';
  Blockly.Msg.CONTROLS_FLOW_STATEMENTS_WARNING = 'Warning: This block may only be used within a loop.';
  Blockly.Msg.CONTROLS_FOREACH_HELPURL = 'https://github.com/google/blockly/wiki/Loops#for-each';
  Blockly.Msg.CONTROLS_FOREACH_TITLE = '对每个 %1 , 来自列表 %2';
  Blockly.Msg.CONTROLS_FOREACH_TOOLTIP = "For each item in a list, set the variable '%1' to the item, and then do some statements.";
  Blockly.Msg.CONTROLS_FOR_HELPURL = 'https://github.com/google/blockly/wiki/Loops#count-with';
  Blockly.Msg.CONTROLS_FOR_TITLE = '循环变量 %1 从 %2 到 %3 每次加 %4';
  Blockly.Msg.CONTROLS_FOR_TOOLTIP = "Have the variable '%1' take on the values from the start number to the end number, counting by the specified interval, and do the specified blocks.";
  Blockly.Msg.CONTROLS_IF_ELSEIF_TOOLTIP = 'Add a condition to the if block.';
  Blockly.Msg.CONTROLS_IF_ELSE_TOOLTIP = 'Add a final, catch-all condition to the if block.';
  Blockly.Msg.CONTROLS_IF_HELPURL = 'https://github.com/google/blockly/wiki/IfElse';
  Blockly.Msg.CONTROLS_IF_IF_TOOLTIP = 'Add, remove, or reorder sections to reconfigure this if block.';
  Blockly.Msg.CONTROLS_IF_MSG_ELSE = '否则';
  Blockly.Msg.CONTROLS_IF_MSG_ELSEIF = '否则，如果';
  Blockly.Msg.CONTROLS_IF_MSG_IF = '如果';
  Blockly.Msg.CONTROLS_IF_TOOLTIP_1 = 'If a value is true, then do some statements.';
  Blockly.Msg.CONTROLS_IF_TOOLTIP_2 = 'If a value is true, then do the first block of statements. Otherwise, do the second block of statements.';
  Blockly.Msg.CONTROLS_IF_TOOLTIP_3 = 'If the first value is true, then do the first block of statements. Otherwise, if the second value is true, do the second block of statements.';
  Blockly.Msg.CONTROLS_IF_TOOLTIP_4 = 'If the first value is true, then do the first block of statements. Otherwise, if the second value is true, do the second block of statements. If none of the values are true, do the last block of statements.';
  Blockly.Msg.CONTROLS_REPEAT_HELPURL = 'https://en.wikipedia.org/wiki/For_loop';
  Blockly.Msg.CONTROLS_REPEAT_INPUT_DO = '运行';
  Blockly.Msg.CONTROLS_REPEAT_TITLE = '循环 %1 次';
  Blockly.Msg.CONTROLS_REPEAT_TOOLTIP = '重复运行命令。';
  Blockly.Msg.CONTROLS_WHILEUNTIL_HELPURL = 'https://github.com/google/blockly/wiki/Loops#repeat';
  Blockly.Msg.CONTROLS_WHILEUNTIL_OPERATOR_UNTIL = '重复运行，直到';
  Blockly.Msg.CONTROLS_WHILEUNTIL_OPERATOR_WHILE = '循环直到';
  Blockly.Msg.CONTROLS_WHILEUNTIL_TOOLTIP_UNTIL = 'While a value is false, then do some statements.';
  Blockly.Msg.CONTROLS_WHILEUNTIL_TOOLTIP_WHILE = 'While a value is true, then do some statements.';
  Blockly.Msg.DELETE_ALL_BLOCKS = '删除共 %1 个命令?';
  Blockly.Msg.DELETE_BLOCK = '删除命令';
  Blockly.Msg.DELETE_VARIABLE = "Delete the '%1' variable";
  Blockly.Msg.DELETE_VARIABLE_CONFIRMATION = "Delete %1 uses of the '%2' variable?";
  Blockly.Msg.DELETE_X_BLOCKS = 'Delete %1 Blocks';
  Blockly.Msg.DISABLE_BLOCK = '禁止运行命令';
  Blockly.Msg.DUPLICATE_BLOCK = '复制';
  Blockly.Msg.ENABLE_BLOCK = '恢复运行命令';
  Blockly.Msg.EXPAND_ALL = '显示完整命令';
  Blockly.Msg.EXPAND_BLOCK = '显示完整命令';
  Blockly.Msg.EXTERNAL_INPUTS = '外部输入';
  Blockly.Msg.HELP = '帮助';
  Blockly.Msg.INLINE_INPUTS = '内部输入';
  Blockly.Msg.LISTS_CREATE_EMPTY_HELPURL = 'https://github.com/google/blockly/wiki/Lists#create-empty-list';
  Blockly.Msg.LISTS_CREATE_EMPTY_TITLE = '新建空白列表';
  Blockly.Msg.LISTS_CREATE_EMPTY_TOOLTIP = 'Returns a list, of length 0, containing no data records';
  Blockly.Msg.LISTS_CREATE_WITH_CONTAINER_TITLE_ADD = '列表';
  Blockly.Msg.LISTS_CREATE_WITH_CONTAINER_TOOLTIP = 'Add, remove, or reorder sections to reconfigure this list block.';
  Blockly.Msg.LISTS_CREATE_WITH_HELPURL = 'https://github.com/google/blockly/wiki/Lists#create-list-with';
  Blockly.Msg.LISTS_CREATE_WITH_INPUT_WITH = '新建列表，包含项目：';
  Blockly.Msg.LISTS_CREATE_WITH_ITEM_TOOLTIP = 'Add an item to the list.';
  Blockly.Msg.LISTS_CREATE_WITH_TOOLTIP = 'Create a list with any number of items.';
  Blockly.Msg.LISTS_GET_INDEX_FIRST = '第一项';
  Blockly.Msg.LISTS_GET_INDEX_FROM_END = '倒数 # ';
  Blockly.Msg.LISTS_GET_INDEX_FROM_START = '#';
  Blockly.Msg.LISTS_GET_INDEX_GET = '获取';
  Blockly.Msg.LISTS_GET_INDEX_GET_REMOVE = '获取并移除';
  Blockly.Msg.LISTS_GET_INDEX_LAST = '最后一项';
  Blockly.Msg.LISTS_GET_INDEX_RANDOM = '随机';
  Blockly.Msg.LISTS_GET_INDEX_REMOVE = '移除';
  Blockly.Msg.LISTS_GET_INDEX_TAIL = '';
  Blockly.Msg.LISTS_GET_INDEX_TOOLTIP_GET_FIRST = 'Returns the first item in a list.';
  Blockly.Msg.LISTS_GET_INDEX_TOOLTIP_GET_FROM = 'Returns the item at the specified position in a list.';
  Blockly.Msg.LISTS_GET_INDEX_TOOLTIP_GET_LAST = 'Returns the last item in a list.';
  Blockly.Msg.LISTS_GET_INDEX_TOOLTIP_GET_RANDOM = 'Returns a random item in a list.';
  Blockly.Msg.LISTS_GET_INDEX_TOOLTIP_GET_REMOVE_FIRST = 'Removes and returns the first item in a list.';
  Blockly.Msg.LISTS_GET_INDEX_TOOLTIP_GET_REMOVE_FROM = 'Removes and returns the item at the specified position in a list.';
  Blockly.Msg.LISTS_GET_INDEX_TOOLTIP_GET_REMOVE_LAST = 'Removes and returns the last item in a list.';
  Blockly.Msg.LISTS_GET_INDEX_TOOLTIP_GET_REMOVE_RANDOM = 'Removes and returns a random item in a list.';
  Blockly.Msg.LISTS_GET_INDEX_TOOLTIP_REMOVE_FIRST = 'Removes the first item in a list.';
  Blockly.Msg.LISTS_GET_INDEX_TOOLTIP_REMOVE_FROM = 'Removes the item at the specified position in a list.';
  Blockly.Msg.LISTS_GET_INDEX_TOOLTIP_REMOVE_LAST = 'Removes the last item in a list.';
  Blockly.Msg.LISTS_GET_INDEX_TOOLTIP_REMOVE_RANDOM = 'Removes a random item in a list.';
  Blockly.Msg.LISTS_GET_SUBLIST_END_FROM_END = '到 倒数 # ';
  Blockly.Msg.LISTS_GET_SUBLIST_END_FROM_START = '到 #';
  Blockly.Msg.LISTS_GET_SUBLIST_END_LAST = '到最后一项';
  Blockly.Msg.LISTS_GET_SUBLIST_HELPURL = 'https://github.com/google/blockly/wiki/Lists#getting-a-sublist';
  Blockly.Msg.LISTS_GET_SUBLIST_START_FIRST = '中，创建分列表：从第一项';
  Blockly.Msg.LISTS_GET_SUBLIST_START_FROM_END = '中，创建分列表：从倒数#';
  Blockly.Msg.LISTS_GET_SUBLIST_START_FROM_START = '中，创建分列表：从 #';
  Blockly.Msg.LISTS_GET_SUBLIST_TAIL = '';
  Blockly.Msg.LISTS_GET_SUBLIST_TOOLTIP = 'Creates a copy of the specified portion of a list.';
  Blockly.Msg.LISTS_INDEX_FROM_END_TOOLTIP = '%1 is the last item.';
  Blockly.Msg.LISTS_INDEX_FROM_START_TOOLTIP = '%1 is the first item.';
  Blockly.Msg.LISTS_INDEX_OF_FIRST = '中找出以下项目 第一次 出现的位置：';
  Blockly.Msg.LISTS_INDEX_OF_HELPURL = 'https://github.com/google/blockly/wiki/Lists#getting-items-from-a-list';
  Blockly.Msg.LISTS_INDEX_OF_LAST = '中找出以下项目 最后一次 出现的位置：';
  Blockly.Msg.LISTS_INDEX_OF_TOOLTIP = 'Returns the index of the first/last occurrence of the item in the list. Returns %1 if item is not found.';
  Blockly.Msg.LISTS_INLIST = '在列表';
  Blockly.Msg.LISTS_ISEMPTY_HELPURL = 'https://github.com/google/blockly/wiki/Lists#is-empty';
  Blockly.Msg.LISTS_ISEMPTY_TITLE = '%1 是空的';
  Blockly.Msg.LISTS_ISEMPTY_TOOLTIP = 'Returns true if the list is empty.';
  Blockly.Msg.LISTS_LENGTH_HELPURL = 'https://github.com/google/blockly/wiki/Lists#length-of';
  Blockly.Msg.LISTS_LENGTH_TITLE = '列表长度 %1';
  Blockly.Msg.LISTS_LENGTH_TOOLTIP = 'Returns the length of a list.';
  Blockly.Msg.LISTS_REPEAT_HELPURL = 'https://github.com/google/blockly/wiki/Lists#create-list-with';
  Blockly.Msg.LISTS_REPEAT_TITLE = '新建列表，其中项目 %1 重复出现 %2 次';
  Blockly.Msg.LISTS_REPEAT_TOOLTIP = 'Creates a list consisting of the given value repeated the specified number of times.';
  Blockly.Msg.LISTS_REVERSE_HELPURL = 'https://github.com/google/blockly/wiki/Lists#reversing-a-list';
  Blockly.Msg.LISTS_REVERSE_MESSAGE0 = 'reverse %1';
  Blockly.Msg.LISTS_REVERSE_TOOLTIP = 'Reverse a copy of a list.';
  Blockly.Msg.LISTS_SET_INDEX_HELPURL = 'https://github.com/google/blockly/wiki/Lists#in-list--set';
  Blockly.Msg.LISTS_SET_INDEX_INPUT_TO = '该项内容：';
  Blockly.Msg.LISTS_SET_INDEX_INSERT = '插入到';
  Blockly.Msg.LISTS_SET_INDEX_SET = '设置';
  Blockly.Msg.LISTS_SET_INDEX_TOOLTIP_INSERT_FIRST = 'Inserts the item at the start of a list.';
  Blockly.Msg.LISTS_SET_INDEX_TOOLTIP_INSERT_FROM = 'Inserts the item at the specified position in a list.';
  Blockly.Msg.LISTS_SET_INDEX_TOOLTIP_INSERT_LAST = 'Append the item to the end of a list.';
  Blockly.Msg.LISTS_SET_INDEX_TOOLTIP_INSERT_RANDOM = 'Inserts the item randomly in a list.';
  Blockly.Msg.LISTS_SET_INDEX_TOOLTIP_SET_FIRST = 'Sets the first item in a list.';
  Blockly.Msg.LISTS_SET_INDEX_TOOLTIP_SET_FROM = 'Sets the item at the specified position in a list.';
  Blockly.Msg.LISTS_SET_INDEX_TOOLTIP_SET_LAST = 'Sets the last item in a list.';
  Blockly.Msg.LISTS_SET_INDEX_TOOLTIP_SET_RANDOM = 'Sets a random item in a list.';
  Blockly.Msg.LISTS_SORT_HELPURL = 'https://github.com/google/blockly/wiki/Lists#sorting-a-list';
  Blockly.Msg.LISTS_SORT_ORDER_ASCENDING = '升序';
  Blockly.Msg.LISTS_SORT_ORDER_DESCENDING = '降序';
  Blockly.Msg.LISTS_SORT_TITLE = '排序 %1 %2 %3';
  Blockly.Msg.LISTS_SORT_TOOLTIP = 'Sort a copy of a list.';
  Blockly.Msg.LISTS_SORT_TYPE_IGNORECASE = '按首字母, 不计大小写';
  Blockly.Msg.LISTS_SORT_TYPE_NUMERIC = '按数字顺序';
  Blockly.Msg.LISTS_SORT_TYPE_TEXT = '按首字母';
  Blockly.Msg.LISTS_SPLIT_HELPURL = 'https://github.com/google/blockly/wiki/Lists#splitting-strings-and-joining-lists';
  Blockly.Msg.LISTS_SPLIT_LIST_FROM_TEXT = '将文字转化为列表';
  Blockly.Msg.LISTS_SPLIT_TEXT_FROM_LIST = '将列表转化为文字';
  Blockly.Msg.LISTS_SPLIT_TOOLTIP_JOIN = 'Join a list of texts into one text, separated by a delimiter.';
  Blockly.Msg.LISTS_SPLIT_TOOLTIP_SPLIT = 'Split text into a list of texts, breaking at each delimiter.';
  Blockly.Msg.LISTS_SPLIT_WITH_DELIMITER = '间隔符号：';
  Blockly.Msg.LOGIC_BOOLEAN_FALSE = '假';
  Blockly.Msg.LOGIC_BOOLEAN_HELPURL = 'https://github.com/google/blockly/wiki/Logic#values';
  Blockly.Msg.LOGIC_BOOLEAN_TOOLTIP = 'Returns either true or false.';
  Blockly.Msg.LOGIC_BOOLEAN_TRUE = '真';
  Blockly.Msg.LOGIC_COMPARE_HELPURL = 'https://en.wikipedia.org/wiki/Inequality_(mathematics)';
  Blockly.Msg.LOGIC_COMPARE_TOOLTIP_EQ = 'Return true if both inputs equal each other.';
  Blockly.Msg.LOGIC_COMPARE_TOOLTIP_GT = 'Return true if the first input is greater than the second input.';
  Blockly.Msg.LOGIC_COMPARE_TOOLTIP_GTE = 'Return true if the first input is greater than or equal to the second input.';
  Blockly.Msg.LOGIC_COMPARE_TOOLTIP_LT = 'Return true if the first input is smaller than the second input.';
  Blockly.Msg.LOGIC_COMPARE_TOOLTIP_LTE = 'Return true if the first input is smaller than or equal to the second input.';
  Blockly.Msg.LOGIC_COMPARE_TOOLTIP_NEQ = 'Return true if both inputs are not equal to each other.';
  Blockly.Msg.LOGIC_NEGATE_HELPURL = 'https://github.com/google/blockly/wiki/Logic#not';
  Blockly.Msg.LOGIC_NEGATE_TITLE = '不是 %1';
  Blockly.Msg.LOGIC_NEGATE_TOOLTIP = 'Returns true if the input is false. Returns false if the input is true.';
  Blockly.Msg.LOGIC_NULL = '空';
  Blockly.Msg.LOGIC_NULL_HELPURL = 'https://en.wikipedia.org/wiki/Nullable_type';
  Blockly.Msg.LOGIC_NULL_TOOLTIP = 'Returns null.';
  Blockly.Msg.LOGIC_OPERATION_AND = '并且';
  Blockly.Msg.LOGIC_OPERATION_HELPURL = 'https://github.com/google/blockly/wiki/Logic#logical-operations';
  Blockly.Msg.LOGIC_OPERATION_OR = '或者';
  Blockly.Msg.LOGIC_OPERATION_TOOLTIP_AND = 'Return true if both inputs are true.';
  Blockly.Msg.LOGIC_OPERATION_TOOLTIP_OR = 'Return true if at least one of the inputs is true.';
  Blockly.Msg.LOGIC_TERNARY_CONDITION = '检测';
  Blockly.Msg.LOGIC_TERNARY_HELPURL = 'https://en.wikipedia.org/wiki/%3F:';
  Blockly.Msg.LOGIC_TERNARY_IF_FALSE = '满足';
  Blockly.Msg.LOGIC_TERNARY_IF_TRUE = '不满足';
  Blockly.Msg.LOGIC_TERNARY_TOOLTIP = "Check the condition in 'test'. If the condition is true, returns the 'if true' value; otherwise returns the 'if false' value.";
  Blockly.Msg.MATH_ADDITION_SYMBOL = '+';
  Blockly.Msg.MATH_ARITHMETIC_HELPURL = 'https://en.wikipedia.org/wiki/Arithmetic';
  Blockly.Msg.MATH_ARITHMETIC_TOOLTIP_ADD = 'Return the sum of the two numbers.';
  Blockly.Msg.MATH_ARITHMETIC_TOOLTIP_DIVIDE = 'Return the quotient of the two numbers.';
  Blockly.Msg.MATH_ARITHMETIC_TOOLTIP_MINUS = 'Return the difference of the two numbers.';
  Blockly.Msg.MATH_ARITHMETIC_TOOLTIP_MULTIPLY = 'Return the product of the two numbers.';
  Blockly.Msg.MATH_ARITHMETIC_TOOLTIP_POWER = 'Return the first number raised to the power of the second number.';
  Blockly.Msg.MATH_CHANGE_HELPURL = 'https://en.wikipedia.org/wiki/Programming_idiom#Incrementing_a_counter';
  Blockly.Msg.MATH_CHANGE_TITLE = ' %1 增加 %2';
  Blockly.Msg.MATH_CHANGE_TOOLTIP = "Add a number to variable '%1'.";
  Blockly.Msg.MATH_CONSTANT_HELPURL = 'https://en.wikipedia.org/wiki/Mathematical_constant';
  Blockly.Msg.MATH_CONSTANT_TOOLTIP = 'Return one of the common constants: π (3.141…), e (2.718…), φ (1.618…), sqrt(2) (1.414…), sqrt(½) (0.707…), or ∞ (infinity).';
  Blockly.Msg.MATH_CONSTRAIN_HELPURL = 'https://en.wikipedia.org/wiki/Clamping_(graphics)';
  Blockly.Msg.MATH_CONSTRAIN_TITLE = '限制 %1 最小值： %2 最大值： %3';
  Blockly.Msg.MATH_CONSTRAIN_TOOLTIP = 'Constrain a number to be between the specified limits (inclusive).';
  Blockly.Msg.MATH_DIVISION_SYMBOL = '÷';
  Blockly.Msg.MATH_IS_DIVISIBLE_BY = '是 可被整除的';
  Blockly.Msg.MATH_IS_EVEN = '是 偶数';
  Blockly.Msg.MATH_IS_NEGATIVE = '是 负数';
  Blockly.Msg.MATH_IS_ODD = '是 奇数';
  Blockly.Msg.MATH_IS_POSITIVE = '是 正数';
  Blockly.Msg.MATH_IS_PRIME = 'is prime';
  Blockly.Msg.MATH_IS_TOOLTIP = 'Check if a number is an even, odd, prime, whole, positive, negative, or if it is divisible by certain number. Returns true or false.';
  Blockly.Msg.MATH_IS_WHOLE = 'is whole';
  Blockly.Msg.MATH_MODULO_HELPURL = 'https://en.wikipedia.org/wiki/Modulo_operation';
  Blockly.Msg.MATH_MODULO_TITLE = '余数： %1 ÷ %2';
  Blockly.Msg.MATH_MODULO_TOOLTIP = 'Return the remainder from dividing the two numbers.';
  Blockly.Msg.MATH_MULTIPLICATION_SYMBOL = '×';
  Blockly.Msg.MATH_NUMBER_HELPURL = 'https://en.wikipedia.org/wiki/Number';
  Blockly.Msg.MATH_NUMBER_TOOLTIP = 'A number.';
  Blockly.Msg.MATH_ONLIST_HELPURL = '';
  Blockly.Msg.MATH_ONLIST_OPERATOR_AVERAGE = '列表平均数 列表名称';
  Blockly.Msg.MATH_ONLIST_OPERATOR_MAX = '列表最大值 列表名称';
  Blockly.Msg.MATH_ONLIST_OPERATOR_MEDIAN = '列表中数 列表名称';
  Blockly.Msg.MATH_ONLIST_OPERATOR_MIN = '列表最小值 列表名称';
  Blockly.Msg.MATH_ONLIST_OPERATOR_MODE = 'modes of list';
  Blockly.Msg.MATH_ONLIST_OPERATOR_RANDOM = '列表中的随机项 列表名称：';
  Blockly.Msg.MATH_ONLIST_OPERATOR_STD_DEV = '列表标准差 列表名称：';
  Blockly.Msg.MATH_ONLIST_OPERATOR_SUM = '列表总和 列表名称：';
  Blockly.Msg.MATH_ONLIST_TOOLTIP_AVERAGE = 'Return the average (arithmetic mean) of the numeric values in the list.';
  Blockly.Msg.MATH_ONLIST_TOOLTIP_MAX = 'Return the largest number in the list.';
  Blockly.Msg.MATH_ONLIST_TOOLTIP_MEDIAN = 'Return the median number in the list.';
  Blockly.Msg.MATH_ONLIST_TOOLTIP_MIN = 'Return the smallest number in the list.';
  Blockly.Msg.MATH_ONLIST_TOOLTIP_MODE = 'Return a list of the most common item(s) in the list.';
  Blockly.Msg.MATH_ONLIST_TOOLTIP_RANDOM = 'Return a random element from the list.';
  Blockly.Msg.MATH_ONLIST_TOOLTIP_STD_DEV = 'Return the standard deviation of the list.';
  Blockly.Msg.MATH_ONLIST_TOOLTIP_SUM = 'Return the sum of all the numbers in the list.';
  Blockly.Msg.MATH_POWER_SYMBOL = '^';
  Blockly.Msg.MATH_RANDOM_FLOAT_HELPURL = 'https://en.wikipedia.org/wiki/Random_number_generation';
  Blockly.Msg.MATH_RANDOM_FLOAT_TITLE_RANDOM = '随机分割';
  Blockly.Msg.MATH_RANDOM_FLOAT_TOOLTIP = 'Return a random fraction between 0.0 (inclusive) and 1.0 (exclusive).';
  Blockly.Msg.MATH_RANDOM_INT_HELPURL = 'https://en.wikipedia.org/wiki/Random_number_generation';
  Blockly.Msg.MATH_RANDOM_INT_TITLE = '随机整数 区间： %1 至 %2';
  Blockly.Msg.MATH_RANDOM_INT_TOOLTIP = 'Return a random integer between the two specified limits, inclusive.';
  Blockly.Msg.MATH_ROUND_HELPURL = 'https://en.wikipedia.org/wiki/Rounding';
  Blockly.Msg.MATH_ROUND_OPERATOR_ROUND = '四舍五入';
  Blockly.Msg.MATH_ROUND_OPERATOR_ROUNDDOWN = '下舍入';
  Blockly.Msg.MATH_ROUND_OPERATOR_ROUNDUP = '上舍入';
  Blockly.Msg.MATH_ROUND_TOOLTIP = 'Round a number up or down.';
  Blockly.Msg.MATH_SINGLE_HELPURL = 'https://en.wikipedia.org/wiki/Square_root';
  Blockly.Msg.MATH_SINGLE_OP_ABSOLUTE = '绝对值';
  Blockly.Msg.MATH_SINGLE_OP_ROOT = '平方根';
  Blockly.Msg.MATH_SINGLE_TOOLTIP_ABS = 'Return the absolute value of a number.';
  Blockly.Msg.MATH_SINGLE_TOOLTIP_EXP = 'Return e to the power of a number.';
  Blockly.Msg.MATH_SINGLE_TOOLTIP_LN = 'Return the natural logarithm of a number.';
  Blockly.Msg.MATH_SINGLE_TOOLTIP_LOG10 = 'Return the base 10 logarithm of a number.';
  Blockly.Msg.MATH_SINGLE_TOOLTIP_NEG = 'Return the negation of a number.';
  Blockly.Msg.MATH_SINGLE_TOOLTIP_POW10 = 'Return 10 to the power of a number.';
  Blockly.Msg.MATH_SINGLE_TOOLTIP_ROOT = 'Return the square root of a number.';
  Blockly.Msg.MATH_SUBTRACTION_SYMBOL = '-';
  Blockly.Msg.MATH_TRIG_ACOS = 'acos';
  Blockly.Msg.MATH_TRIG_ASIN = 'asin';
  Blockly.Msg.MATH_TRIG_ATAN = 'atan';
  Blockly.Msg.MATH_TRIG_COS = 'cos';
  Blockly.Msg.MATH_TRIG_HELPURL = 'https://en.wikipedia.org/wiki/Trigonometric_functions';
  Blockly.Msg.MATH_TRIG_SIN = 'sin';
  Blockly.Msg.MATH_TRIG_TAN = 'tan';
  Blockly.Msg.MATH_TRIG_TOOLTIP_ACOS = 'Return the arccosine of a number.';
  Blockly.Msg.MATH_TRIG_TOOLTIP_ASIN = 'Return the arcsine of a number.';
  Blockly.Msg.MATH_TRIG_TOOLTIP_ATAN = 'Return the arctangent of a number.';
  Blockly.Msg.MATH_TRIG_TOOLTIP_COS = 'Return the cosine of a degree (not radian).';
  Blockly.Msg.MATH_TRIG_TOOLTIP_SIN = 'Return the sine of a degree (not radian).';
  Blockly.Msg.MATH_TRIG_TOOLTIP_TAN = 'Return the tangent of a degree (not radian).';
  Blockly.Msg.NEW_VARIABLE = '新建变量';
  Blockly.Msg.NEW_VARIABLE_TITLE = '新变量名称：';
  Blockly.Msg.ORDINAL_NUMBER_SUFFIX = '';
  Blockly.Msg.PROCEDURES_ALLOW_STATEMENTS = 'allow statements';
  Blockly.Msg.PROCEDURES_BEFORE_PARAMS = '内含变量：';
  Blockly.Msg.PROCEDURES_CALLNORETURN_HELPURL = 'https://en.wikipedia.org/wiki/Subroutine';
  Blockly.Msg.PROCEDURES_CALLNORETURN_TOOLTIP = "Run the user-defined function '%1'.";
  Blockly.Msg.PROCEDURES_CALLRETURN_HELPURL = 'https://en.wikipedia.org/wiki/Subroutine';
  Blockly.Msg.PROCEDURES_CALLRETURN_TOOLTIP = "Run the user-defined function '%1' and use its output.";
  Blockly.Msg.PROCEDURES_CALL_BEFORE_PARAMS = '内含变量：';
  Blockly.Msg.PROCEDURES_CREATE_DO = "新建 '%1'";
  Blockly.Msg.PROCEDURES_DEFNORETURN_COMMENT = '（添加描述）';
  Blockly.Msg.PROCEDURES_DEFNORETURN_DO = '';
  Blockly.Msg.PROCEDURES_DEFNORETURN_HELPURL = 'https://en.wikipedia.org/wiki/Subroutine';
  Blockly.Msg.PROCEDURES_DEFNORETURN_PROCEDURE = '（函数名）';
  Blockly.Msg.PROCEDURES_DEFNORETURN_TITLE = '定义函数';
  Blockly.Msg.PROCEDURES_DEFNORETURN_TOOLTIP = 'Creates a function with no output.';
  Blockly.Msg.PROCEDURES_DEFRETURN_HELPURL = 'https://en.wikipedia.org/wiki/Subroutine';
  Blockly.Msg.PROCEDURES_DEFRETURN_RETURN = '输出：';
  Blockly.Msg.PROCEDURES_DEFRETURN_TOOLTIP = 'Creates a function with an output.';
  Blockly.Msg.PROCEDURES_DEF_DUPLICATE_WARNING = '错误提醒：该函数重复使用了同一参数。';
  Blockly.Msg.PROCEDURES_HIGHLIGHT_DEF = '强调函数定义。';
  Blockly.Msg.PROCEDURES_IFRETURN_HELPURL = 'http://c2.com/cgi/wiki?GuardClause';
  Blockly.Msg.PROCEDURES_IFRETURN_TOOLTIP = 'If a value is true, then return a second value.';
  Blockly.Msg.PROCEDURES_IFRETURN_WARNING = '提示：该命令只能内置于函数中。';
  Blockly.Msg.PROCEDURES_MUTATORARG_TITLE = '输入名称：';
  Blockly.Msg.PROCEDURES_MUTATORARG_TOOLTIP = 'Add an input to the function.';
  Blockly.Msg.PROCEDURES_MUTATORCONTAINER_TITLE = '输入值';
  Blockly.Msg.PROCEDURES_MUTATORCONTAINER_TOOLTIP = 'Add, remove, or reorder inputs to this function.';
  Blockly.Msg.REDO = '重做';
  Blockly.Msg.REMOVE_COMMENT = '移除描述';
  Blockly.Msg.RENAME_VARIABLE = '重命名变量';
  Blockly.Msg.RENAME_VARIABLE_TITLE = "重命名所有 '%1' 变量为：";
  Blockly.Msg.TEXT_APPEND_APPENDTEXT = '添加文本';
  Blockly.Msg.TEXT_APPEND_HELPURL = 'https://github.com/google/blockly/wiki/Text#text-modification';
  Blockly.Msg.TEXT_APPEND_TO = '为';
  Blockly.Msg.TEXT_APPEND_TOOLTIP = "Append some text to variable '%1'.";
  Blockly.Msg.TEXT_CHANGECASE_HELPURL = 'https://github.com/google/blockly/wiki/Text#adjusting-text-case';
  Blockly.Msg.TEXT_CHANGECASE_OPERATOR_LOWERCASE = '全部小写';
  Blockly.Msg.TEXT_CHANGECASE_OPERATOR_TITLECASE = '首字母大写';
  Blockly.Msg.TEXT_CHANGECASE_OPERATOR_UPPERCASE = '全部大写';
  Blockly.Msg.TEXT_CHANGECASE_TOOLTIP = 'Return a copy of the text in a different case.';
  Blockly.Msg.TEXT_CHARAT_FIRST = '中获取 首字母';
  Blockly.Msg.TEXT_CHARAT_FROM_END = '中获取 字母：倒数 # ';
  Blockly.Msg.TEXT_CHARAT_FROM_START = '中获取 字母： #';
  Blockly.Msg.TEXT_CHARAT_HELPURL = 'https://github.com/google/blockly/wiki/Text#extracting-text';
  Blockly.Msg.TEXT_CHARAT_INPUT_INTEXT = '在文本 ';
  Blockly.Msg.TEXT_CHARAT_LAST = '中获取 最后一个字母';
  Blockly.Msg.TEXT_CHARAT_RANDOM = '中获取 任意字母';
  Blockly.Msg.TEXT_CHARAT_TAIL = '';
  Blockly.Msg.TEXT_CHARAT_TOOLTIP = 'Returns the letter at the specified position.';
  Blockly.Msg.TEXT_COUNT_HELPURL = 'https://github.com/google/blockly/wiki/Text#counting-substrings';
  Blockly.Msg.TEXT_COUNT_MESSAGE0 = 'count %1 in %2';
  Blockly.Msg.TEXT_COUNT_TOOLTIP = 'Count how many times some text occurs within some other text.';
  Blockly.Msg.TEXT_CREATE_JOIN_ITEM_TOOLTIP = 'Add an item to the text.';
  Blockly.Msg.TEXT_CREATE_JOIN_TITLE_JOIN = 'join';
  Blockly.Msg.TEXT_CREATE_JOIN_TOOLTIP = 'Add, remove, or reorder sections to reconfigure this text block.';
  Blockly.Msg.TEXT_GET_SUBSTRING_END_FROM_END = '到 倒数 # ';
  Blockly.Msg.TEXT_GET_SUBSTRING_END_FROM_START = '到 字母 #';
  Blockly.Msg.TEXT_GET_SUBSTRING_END_LAST = '到 最后一个爱慕';
  Blockly.Msg.TEXT_GET_SUBSTRING_HELPURL = 'https://github.com/google/blockly/wiki/Text#extracting-a-region-of-text';
  Blockly.Msg.TEXT_GET_SUBSTRING_INPUT_IN_TEXT = '从文本';
  Blockly.Msg.TEXT_GET_SUBSTRING_START_FIRST = '中创建新文本： 从 第一个字母';
  Blockly.Msg.TEXT_GET_SUBSTRING_START_FROM_END = '中创建新文本： 从 字母-倒数 # ';
  Blockly.Msg.TEXT_GET_SUBSTRING_START_FROM_START = '中创建新文本： 从 字母 #';
  Blockly.Msg.TEXT_GET_SUBSTRING_TAIL = '';
  Blockly.Msg.TEXT_GET_SUBSTRING_TOOLTIP = 'Returns a specified portion of the text.';
  Blockly.Msg.TEXT_INDEXOF_HELPURL = 'https://github.com/google/blockly/wiki/Text#finding-text';
  Blockly.Msg.TEXT_INDEXOF_INPUT_INTEXT = '在文本';
  Blockly.Msg.TEXT_INDEXOF_OPERATOR_FIRST = '中找出以下文本 第一次 出现的位置： 文本';
  Blockly.Msg.TEXT_INDEXOF_OPERATOR_LAST = '中找出以下文本 最后一次 出现的位置： 文本';
  Blockly.Msg.TEXT_INDEXOF_TAIL = '';
  Blockly.Msg.TEXT_INDEXOF_TOOLTIP = 'Returns the index of the first/last occurrence of the first text in the second text. Returns %1 if text is not found.';
  Blockly.Msg.TEXT_ISEMPTY_HELPURL = 'https://github.com/google/blockly/wiki/Text#checking-for-empty-text';
  Blockly.Msg.TEXT_ISEMPTY_TITLE = '%1 是空的';
  Blockly.Msg.TEXT_ISEMPTY_TOOLTIP = 'Returns true if the provided text is empty.';
  Blockly.Msg.TEXT_JOIN_HELPURL = 'https://github.com/google/blockly/wiki/Text#text-creation';
  Blockly.Msg.TEXT_JOIN_TITLE_CREATEWITH = '创建文本，连接以下几项：';
  Blockly.Msg.TEXT_JOIN_TOOLTIP = 'Create a piece of text by joining together any number of items.';
  Blockly.Msg.TEXT_LENGTH_HELPURL = 'https://github.com/google/blockly/wiki/Text#text-modification';
  Blockly.Msg.TEXT_LENGTH_TITLE = '获取文本长度 %1';
  Blockly.Msg.TEXT_LENGTH_TOOLTIP = 'Returns the number of letters (including spaces) in the provided text.';
  Blockly.Msg.TEXT_PRINT_HELPURL = 'https://github.com/google/blockly/wiki/Text#printing-text';
  Blockly.Msg.TEXT_PRINT_TITLE = '显示文本： %1';
  Blockly.Msg.TEXT_PRINT_TOOLTIP = 'Print the specified text, number or other value.';
  Blockly.Msg.TEXT_PROMPT_HELPURL = 'https://github.com/google/blockly/wiki/Text#getting-input-from-the-user';
  Blockly.Msg.TEXT_PROMPT_TOOLTIP_NUMBER = 'Prompt for user for a number.';
  Blockly.Msg.TEXT_PROMPT_TOOLTIP_TEXT = 'Prompt for user for some text.';
  Blockly.Msg.TEXT_PROMPT_TYPE_NUMBER = 'prompt for number with message';
  Blockly.Msg.TEXT_PROMPT_TYPE_TEXT = '当 文本 出现时，弹窗提醒：';
  Blockly.Msg.TEXT_REPLACE_HELPURL = 'https://github.com/google/blockly/wiki/Text#replacing-substrings';
  Blockly.Msg.TEXT_REPLACE_MESSAGE0 = 'replace %1 with %2 in %3';
  Blockly.Msg.TEXT_REPLACE_TOOLTIP = 'Replace all occurances of some text within some other text.';
  Blockly.Msg.TEXT_REVERSE_HELPURL = 'https://github.com/google/blockly/wiki/Text#reversing-text';
  Blockly.Msg.TEXT_REVERSE_MESSAGE0 = 'reverse %1';
  Blockly.Msg.TEXT_REVERSE_TOOLTIP = 'Reverses the order of the characters in the text.';
  Blockly.Msg.TEXT_TEXT_HELPURL = 'https://en.wikipedia.org/wiki/String_(computer_science)';
  Blockly.Msg.TEXT_TEXT_TOOLTIP = 'A letter, word, or line of text.';
  Blockly.Msg.TEXT_TRIM_HELPURL = 'https://github.com/google/blockly/wiki/Text#trimming-removing-spaces';
  Blockly.Msg.TEXT_TRIM_OPERATOR_BOTH = '消除空格 两侧 文本：';
  Blockly.Msg.TEXT_TRIM_OPERATOR_LEFT = '消除空格 左侧 文本：';
  Blockly.Msg.TEXT_TRIM_OPERATOR_RIGHT = '消除空格 右侧 文本：';
  Blockly.Msg.TEXT_TRIM_TOOLTIP = 'Return a copy of the text with spaces removed from one or both ends.';
  Blockly.Msg.TODAY = '今天';
  Blockly.Msg.UNDO = '撤销';
  Blockly.Msg.VARIABLES_DEFAULT_NAME = '项';
  Blockly.Msg.VARIABLES_GET_CREATE_SET = "创建 '设置 %1'";
  Blockly.Msg.VARIABLES_GET_HELPURL = 'https://github.com/google/blockly/wiki/Variables#get';
  Blockly.Msg.VARIABLES_GET_TOOLTIP = 'Returns the value of this variable.';
  Blockly.Msg.VARIABLES_SET = '设 %1 为 %2';
  Blockly.Msg.VARIABLES_SET_CREATE_GET = "创建 'get %1'";
  Blockly.Msg.VARIABLES_SET_HELPURL = 'https://github.com/google/blockly/wiki/Variables#set';
  Blockly.Msg.VARIABLES_SET_TOOLTIP = 'Sets this variable to be equal to the input.';
  Blockly.Msg.VARIABLE_ALREADY_EXISTS = "名为 '%1' 的变量已经存在。";
  Blockly.Msg.PROCEDURES_DEFRETURN_TITLE = Blockly.Msg.PROCEDURES_DEFNORETURN_TITLE;
  Blockly.Msg.CONTROLS_IF_IF_TITLE_IF = Blockly.Msg.CONTROLS_IF_MSG_IF;
  Blockly.Msg.CONTROLS_WHILEUNTIL_INPUT_DO = Blockly.Msg.CONTROLS_REPEAT_INPUT_DO;
  Blockly.Msg.CONTROLS_IF_MSG_THEN = Blockly.Msg.CONTROLS_REPEAT_INPUT_DO;
  Blockly.Msg.CONTROLS_IF_ELSE_TITLE_ELSE = Blockly.Msg.CONTROLS_IF_MSG_ELSE;
  Blockly.Msg.PROCEDURES_DEFRETURN_PROCEDURE = Blockly.Msg.PROCEDURES_DEFNORETURN_PROCEDURE;
  Blockly.Msg.LISTS_GET_SUBLIST_INPUT_IN_LIST = Blockly.Msg.LISTS_INLIST;
  Blockly.Msg.LISTS_GET_INDEX_INPUT_IN_LIST = Blockly.Msg.LISTS_INLIST;
  Blockly.Msg.MATH_CHANGE_TITLE_ITEM = Blockly.Msg.VARIABLES_DEFAULT_NAME;
  Blockly.Msg.PROCEDURES_DEFRETURN_DO = Blockly.Msg.PROCEDURES_DEFNORETURN_DO;
  Blockly.Msg.CONTROLS_IF_ELSEIF_TITLE_ELSEIF = Blockly.Msg.CONTROLS_IF_MSG_ELSEIF;
  Blockly.Msg.LISTS_GET_INDEX_HELPURL = Blockly.Msg.LISTS_INDEX_OF_HELPURL;
  Blockly.Msg.CONTROLS_FOREACH_INPUT_DO = Blockly.Msg.CONTROLS_REPEAT_INPUT_DO;
  Blockly.Msg.LISTS_SET_INDEX_INPUT_IN_LIST = Blockly.Msg.LISTS_INLIST;
  Blockly.Msg.CONTROLS_FOR_INPUT_DO = Blockly.Msg.CONTROLS_REPEAT_INPUT_DO;
  Blockly.Msg.LISTS_CREATE_WITH_ITEM_TITLE = Blockly.Msg.VARIABLES_DEFAULT_NAME;
  Blockly.Msg.TEXT_APPEND_VARIABLE = Blockly.Msg.VARIABLES_DEFAULT_NAME;
  Blockly.Msg.TEXT_CREATE_JOIN_ITEM_TITLE_ITEM = Blockly.Msg.VARIABLES_DEFAULT_NAME;
  Blockly.Msg.LISTS_INDEX_OF_INPUT_IN_LIST = Blockly.Msg.LISTS_INLIST;
  Blockly.Msg.PROCEDURES_DEFRETURN_COMMENT = Blockly.Msg.PROCEDURES_DEFNORETURN_COMMENT;

  Blockly.Msg.MATH_HUE = '230';
  Blockly.Msg.LOOPS_HUE = '120';
  Blockly.Msg.LISTS_HUE = '260';
  Blockly.Msg.LOGIC_HUE = '210';
  Blockly.Msg.VARIABLES_HUE = '330';
  Blockly.Msg.TEXTS_HUE = '160';
  Blockly.Msg.PROCEDURES_HUE = '290';
  Blockly.Msg.COLOUR_HUE = '20';
  Blockly.Msg.CATEGORY_BASIC = '基本';
  Blockly.Msg.CATEGORY_ADVANCE = '进阶';
  Blockly.Msg.CATEGORY_MORE = '更多';
  Blockly.Msg.CATEGORY_SOUND = '声音';
  Blockly.Msg.CATEGORY_MOTION = '运动';
  Blockly.Msg.CATEGORY_INPUT = '输入';
  Blockly.Msg.CATEGORY_CONDITION = '条件';
  Blockly.Msg.CATEGORY_EVENT = '事件';
  Blockly.Msg.CATEGORY_LOGIC = '逻辑';
  Blockly.Msg.CATEGORY_LOOP = '循环';
  Blockly.Msg.CATEGORY_MATH = '运算';
  Blockly.Msg.CATEGORY_TEXT = '文字';
  Blockly.Msg.CATEGORY_LIST = '列表';
  Blockly.Msg.CATEGORY_VARIABLE = '变量';
  Blockly.Msg.CATEGORY_FUNCTION = '函数';
  Blockly.Msg.LABEL_GROVE_PIN_TIP = '以下模块请先设置端口，否则无法使用';
  Blockly.Msg.LABEL_MINI_FAN = '迷你风扇';
  Blockly.Msg.LABEL_ELECTROMAGNET = '磁铁';
  Blockly.Msg.LABEL_ULTRASONIC = '超声波传感器';
  Blockly.Msg.LABEL_COLOR_SENSOR = '颜色传感器';
  Blockly.Msg.LABEL_GESTURE = '手势传感器';
  Blockly.Msg.LABEL_TEMPERATURE = '温湿度传感器';
  Blockly.Msg.LABEL_PIR_MOTION = '红外运动传感器';
  Blockly.Msg.CONDITION_TIP_SENSOR = '按下吸头';
  Blockly.Msg.CONDITION_FACE_DETECTION = '识别到人脸';
  Blockly.Msg.CONDITION_BUTTON = '按下按钮';
  Blockly.Msg.CONDITION_KEY = '按下键盘';
  Blockly.Msg.CONDITION_CURRENT_POSITION = '位置';
  Blockly.Msg.BUTTON_MENU = '菜单';
  Blockly.Msg.BUTTON_PLAY = '播放';
  Blockly.Msg.BUTTON_SHORT_PRESS = '短按';
  Blockly.Msg.BUTTON_LONG_PRESS = '长按';
  Blockly.Msg.KEY_UP = '松开';
  Blockly.Msg.KEY_DOWN = '按下';
  Blockly.Msg.NOTE = '音符';
  Blockly.Msg.BEAT = '节拍';
  Blockly.Msg.BEEP = '蜂鸣器';
  Blockly.Msg.HZ = '赫兹';
  Blockly.Msg.LAST = '持续';
  Blockly.Msg.SEC = '秒';
  Blockly.Msg.PLAY = '播放';
  Blockly.Msg.TEMPERATURE_PIN = '温湿度传感器 端口';
  Blockly.Msg.TEMPERATURE_GET = '当前温度';
  Blockly.Msg.HUMIDITY_GET = '当前湿度';
  Blockly.Msg.PIR_MOTION_PIN = '运动传感器 端口';
  Blockly.Msg.MOTION_DECTECTED = '检测到运动';
  Blockly.Msg.ELECTRONMAGNET = '电磁铁 端口';
// Logic
  Blockly.Msg.LOGIC_WAIT = '等待';
  Blockly.Msg.LOGIC_WAIT_UNTIL = '等待直到';
// Text
  Blockly.Msg.TEXT_CONSOLE = '控制台打印';
// Loop
  Blockly.Msg.LOOP_FOREVER = '一直循环';
  Blockly.Msg.LOOP_WHILE = '当';
  Blockly.Msg.LOOP_UNTIL = '直到';
  Blockly.Msg.LOOP_DO = '重复执行';
  Blockly.Msg.LOOP_TIMES = '次';
  Blockly.Msg.LOOP_REPEAT = '重复';
  Blockly.Msg.LOOP_BREAK = '跳出循环';
  Blockly.Msg.WARNING = '警告';
  Blockly.Msg.MSG_LOOP_BREAK = '只能用在循环里';
// Grove
  Blockly.Msg.GROVE_CHOOSE = '选择';
  Blockly.Msg.MSG_GROVE_PIN = '端口 {PIN} 已被占用，请选择其它端口。';
  Blockly.Msg.MSG_GROVE_SAME = '很抱歉，Blockly 不支持同时使用两个同类型Grove模块...';
// Grove Gesture
  Blockly.Msg.GROVE_GESTURE = '手势';
  Blockly.Msg.GROVE_GET_GESTURE = '手势类型';
// Grove Color
  Blockly.Msg.GROVE_COLOR_HUE = '颜色hue';
  Blockly.Msg.BETWEEN = '从';
  Blockly.Msg.AND = '到';
  Blockly.Msg.GROVE_GET_COLOR_HUE = '获取颜色hue值';
// Blockly Compatible
  Blockly.Msg.MSG_CONFIRM = '确认';
  Blockly.Msg.MSG_CANCEL = '取消';
  Blockly.Msg.VERSION_INCOMPATIBLE = '该项目与当前 Blockly 版本不兼容，可能会引起其它问题，请问要继续吗？';
// Blockly Grove Chain LED
  Blockly.Msg.GROVE_CHAINABLE_LED = '可串联 LED';
  Blockly.Msg.GROVE_LED = 'LED';
  Blockly.Msg.NUMBER = '序号';
  Blockly.Msg.GROVE_TURN_OFF_LED = '关闭LED';
  Blockly.Msg.PIN = '端口';
// Blocklyg Grove Button
  Blockly.Msg.GROVE_BUTTON = 'Grove按钮';
  Blockly.Msg.GROVE_BUTTON_LABEL = 'Grove按钮';
// Blockly Grove Slide
  Blockly.Msg.GROVE_SLIDE_LABEL = '滑动变阻器';
  Blockly.Msg.GROVE_POTENTIOMETER = '变阻器值';
  Blockly.Msg.GROVE_SLIDED_TO = '滑动到';
  Blockly.Msg.GROVE_SLIDE_LED = '滑动变阻器LED灯';

// Blockly Grove Rotary
  Blockly.Msg.GROVE_ROTARY_LABEL = '旋转角度传感器';
  Blockly.Msg.GROVE_GET_ROTARY = '旋转角度';
  Blockly.Msg.GROVE_ROTARY_TO = '旋转到';
  Blockly.Msg.GROVE_MIN = '最小值';
  Blockly.Msg.GROVE_MAX = '最大值';

// Blockly Grove Light Sensor
  Blockly.Msg.GROVE_LIGHT_LEVEL = '光线强度';
  Blockly.Msg.GROVE_LIGHT_LABEL = '光线传感器';

  // Blockly. Grove Air Sensor
  Blockly.Msg.GROVE_AIR_QUALITY = '空气质量';
  Blockly.Msg.GROVE_AIR_QUALITY_LABEL = '空气质量传感器';

  // Blockly. Grove Sound Sensor
  Blockly.Msg.GROVE_SOUND_LEVEL = '声音强度';
  Blockly.Msg.GROVE_SOUND_LABEL = '声音传感器';

  // Blockly. Grove Accelerometer Compass
  Blockly.Msg.GROVE_ACCELEROMETER = '加速度 轴';
  Blockly.Msg.GROVE_COMPASS = '地磁偏角';
  Blockly.Msg.GROVE_ACCELEROMETER_LABEL = '加速度 指南针';

  // Blockly Grove Vibration Motor
  Blockly.Msg.GROVE_VIBRATION_MOTOR = '震动马达';
  Blockly.Msg.GROVE_VIBRATION_MOTOR_LABEL = '震动马达';

  // Blockly Grove EMG Detector Sensor
  Blockly.Msg.GROVE_EMG_DETECTOR_LABEL = '肌电传感器';
  Blockly.Msg.GROVE_EMG_DETECTOR = '肌电信号';

  // Blockly Grove Line Finder Sensor
  Blockly.Msg.GROVE_LINE_FINDER_LABEL = '循线传感器';
  Blockly.Msg.GROVE_LINE_FINDER = '检测到黑线';

  // Blockly Grove Oled
  Blockly.Msg.GROVE_OLED_LABEL = 'OLED屏幕';
  Blockly.Msg.GROVE_OLED_SHOW_PIXELS = '显示图案';
  Blockly.Msg.GROVE_OLED_HIDE_PIXELS = '清除图案';

  // Blockly Grove LCD DISPLAY
  Blockly.Msg.GROVE_LCD_LABEL = 'LCD屏幕';
  Blockly.Msg.GROVE_LCD_DISPLAY = '显示';
  Blockly.Msg.GROVE_LCD_DISPLAY_CLEAR = '清除LCD屏幕';
  Blockly.Msg.LINE = '行';

  Blockly.Msg.motion = {
    position: '坐标',
    moveto: '移动到',
    move: '向',
    stretch: 'Stretch',
    baseturn: '底座旋转到',
    wristturn: '末端旋转到',
    suction: '吸头',
    gripper: '夹子',
    play_note: '播放音符',
    beat: '节拍',
    beep: {
      a: '蜂鸣器发声',
      b: '赫兹',
      c: '持续',
      d: '秒',
    },
    on: '开关',
    wait: '等待',
    playrecord: {
      play: '播放轨迹',
      choose: '请选择',
      speed: '播放速度',
    },
    speed: '运动速度:',
    fullspeed: '最大速度',
    reset: '复位',
  };
  Blockly.Msg.comment = {
    move: '让uArm在指定方向上做相对运动（绝对坐标系下：上/下/前/后/左/右）。',
    stretch: '让uArm的“手臂”伸展/缩回（极坐标系下，增加/减少半径）。',
    wrist: 'uArm末端旋转至指定角度（0 - 180度）。',
    base: 'uArm底座旋转至指定角度（0 - 180度）',
    reset: '让uArm复位到初始位置。',
    tipsensor: '按压吸头，触发指定命令（uArm的吸头也是一个开关）。',
    record: '播放你通过“手持示教”录制的uArm运动轨迹。',
    press: '通过按下uArm底座的按钮（菜单按钮、播放按钮），触发指定命令。',
  };
  Blockly.Msg.events = {
    key: {
      press: '按',
      do: '键执行',
    },
    face: '识别到人脸时，执行 ',
    suction: '按压吸头后，执行',
    button: {
      press: '按下底座',
      do: '后，执行',
      menu: '菜单按钮',
      play: '播放按钮',
    },
    stopkeyboard: '停止键盘事件',
    stopface: '停止人脸识别',
    stoptipsensor: '停止按压吸头事件',
    stopbutton: '停止底座按钮事件',
  };
  Blockly.Msg.direction = {
    not_detected: '未检测',
    forward: '前',
    backward: '后',
    left: '左',
    right: '右',
    up: '上',
    down: '下',
    clockwise: '顺时针',
    counterclockwise: '逆时针',
  };
  Blockly.Msg.grove = {
    tip: '请先设置端口，否则无法使用 Grove 模块',
    pin: '端口',
    min: '最小',
    max: '最大',
    gesture: {
      label: '手势传感器',
      get_gesture: '获取当前手势',
      is: '是',
      title: '手势',
    },
    ultrasonic: {
      label: '超声波传感器',
      distance: '获取障碍物距离',
      title: '超声波传感器',
    },
    color: {
      label: '颜色传感器',
      is_in: '符合',
      get_hue: '获取颜色Hue',
      hue_range: 'Hue 值范围',
    },
    fan: {
      label: '迷你风扇',
      title: '迷你风扇',
      speed: '速度',
      stop: '停止迷你风扇',
    },
  };
}

exports.initBlocklyMsg = initBlocklyMsg;
