        let isTeachingMode = false;
        let eventSource = null;
        let currentAnswer = "";
        let currentHint = "";
        let lastQuestionType = "";
        
        let scoreCorrect = 0;
        let scoreIncorrect = 0;
        let scoreSkipped = 0;
        let currentQuestionStatus = "unattempted";

        function finalizeCurrentQuestion() {
            if (currentQuestionStatus === "correct") {
                scoreCorrect++;
            } else if (currentQuestionStatus === "wrong") {
                scoreIncorrect++;
            } else if (currentQuestionStatus === "unattempted") {
                scoreSkipped++;
            }
            currentQuestionStatus = "completed";
            updateScoreUI();
        }

        function updateScoreUI() {
            document.getElementById("count-correct").innerText = scoreCorrect;
            document.getElementById("count-incorrect").innerText = scoreIncorrect;
            document.getElementById("count-skipped").innerText = scoreSkipped;
            
            const total = scoreCorrect + scoreIncorrect + scoreSkipped;
            if (total > 0) {
                document.getElementById("bar-correct").style.width = (scoreCorrect / total * 100) + "%";
                document.getElementById("bar-incorrect").style.width = (scoreIncorrect / total * 100) + "%";
                document.getElementById("bar-skipped").style.width = (scoreSkipped / total * 100) + "%";
            } else {
                document.getElementById("bar-correct").style.width = "0%";
                document.getElementById("bar-incorrect").style.width = "0%";
                document.getElementById("bar-skipped").style.width = "0%";
            }
        }

        const level1Types = [
            "setup", "loop", "serial_begin_serial", "serial_begin_begin", "delay"
        ];
        
        const level2Types = [
            "serial_print_serial", "serial_print_print",
            "serial_println_serial", "serial_println_println",
            "pinmode_cmd", "pinmode_mode", "digitalwrite_cmd", "digitalwrite_state"
        ];

        const level3Types = [
            "var_int", "var_float", "var_string", "var_bool", "var_char"
        ];

        const level4Types = [
            "const_int", "define_pin", "math_inc", "math_dec", "math_mod", "compare_eq", "compare_neq"
        ];
        
        const level5Types = [
            "if_cond", "else_cond", "else_if_cond"
        ];
        
        const level6Types = [
            "for_loop", "while_loop"
        ];
        
        const level7Types = [
            "digital_read", "analog_read", "analog_write"
        ];

        const level8Types = [
            "func_void", "func_return"
        ];

        const level9Types = [
            "logic_and", "logic_or", "logic_not", "time_millis", "math_map", "math_random"
        ];

        const level10Types = [
            "switch_cmd", "case_cmd", "break_cmd", "array_declare", "include_lib"
        ];

        const BOARD_CONFIG = {
            all: {
                subtitle: "ฝึกเติม code Arduino / ESP8266 / ESP32 ในช่องว่าง",
                pins: [4, 13],
                ledPin: 13,
                buttonPin: 4,
                pwmPin: 5,
                baudRate: 9600,
                highVoltageHint: "สั่งจ่ายไฟ HIGH (5V บน Arduino / 3.3V บน ESP) พิมพ์ใหญ่ทั้งหมด",
                lowVoltageHint: "สั่งตัดไฟ LOW (0V) พิมพ์ใหญ่ทั้งหมด",
                stringExample: "IoT",
                analogPin: "A0",
                analogMax: 1023,
                analogComment: "// อ่านค่าอนาล็อก (Uno/ESP8266: 0-1023, ESP32: 0-4095)",
                analogHint: "อ่านค่าอนาล็อก (Uno: A0-A5, ESP8266: A0, ESP32: ขา ADC เช่น 34)",
                pwmComment: "// สั่งจ่ายไฟ PWM ครึ่งหนึ่ง (บน ESP32 แนะนำขาเขียวเช่น 18)",
                pwmHint: "สั่งจ่ายสัญญาณ PWM (ค่า 0-255, ESP32 ใช้ Core v2+)",
                mapHint: "ฟังก์ชันแปลงช่วงค่า (เช่น 0-1023 เป็น 0-255, ESP32 ใช้ 0-4095)",
                arrayDecl: "int scores__________ = {10, 20, 30, 40, 50};",
                libHeader: "Wire.h",
                libBody: " // ไลบรารีสื่อสาร I2C (ใช้ได้กับทุกบอร์ด)",
                libHint: "คำสั่งเรียกใช้งานไลบรารีเพิ่มเติม (ขึ้นต้นด้วย #)"
            },
            arduino: {
                subtitle: "ฝึกเติม code Arduino ในช่องว่าง",
                pins: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
                ledPin: 13,
                buttonPin: 2,
                pwmPin: 9,
                baudRate: 9600,
                highVoltageHint: "สั่งจ่ายไฟ 5V (พิมพ์ใหญ่ทั้งหมด)",
                lowVoltageHint: "สั่งตัดไฟ 0V (พิมพ์ใหญ่ทั้งหมด)",
                stringExample: "Arduino",
                analogPin: "A0",
                analogMax: 1023,
                analogComment: "// อ่านค่าอนาล็อก 0-1023",
                analogHint: "อ่านค่าอนาล็อกจากขา A0 ถึง A5",
                pwmComment: "// สั่งจ่ายไฟ PWM ครึ่งหนึ่ง (0-255)",
                pwmHint: "สั่งจ่ายสัญญาณ PWM (ค่า 0-255)",
                mapHint: "ฟังก์ชันแปลงช่วงค่า (เช่น 0-1023 เป็น 0-255)",
                arrayDecl: "int ledPins__________ = {2, 3, 4, 5, 6};",
                libHeader: "Servo.h",
                libBody: "\n\nServo myServo;",
                libHint: "คำสั่งเรียกใช้งานไลบรารีเพิ่มเติม (ขึ้นต้นด้วย #)"
            },
            esp8266: {
                subtitle: "ฝึกเติม code ESP8266 ในช่องว่าง",
                pins: [4, 5, 12, 13, 14],
                ledPin: 2,
                buttonPin: 4,
                pwmPin: 5,
                baudRate: 115200,
                highVoltageHint: "สั่งจ่ายไฟ 3.3V (พิมพ์ใหญ่ทั้งหมด)",
                lowVoltageHint: "สั่งตัดไฟ 0V (พิมพ์ใหญ่ทั้งหมด)",
                stringExample: "ESP8266",
                analogPin: "A0",
                analogMax: 1023,
                analogComment: "// อ่านค่าอนาล็อก 0-1023",
                analogHint: "อ่านค่าอนาล็อกจากขา A0 (ESP8266 มีขาอนาล็อก 1 ขา)",
                pwmComment: "// สั่งจ่ายไฟ PWM ครึ่งหนึ่ง (0-255)",
                pwmHint: "สั่งจ่ายสัญญาณ PWM บน ESP8266 (ค่า 0-255, Core 3.0+)",
                mapHint: "ฟังก์ชันแปลงช่วงค่า (เช่น 0-1023 เป็น 0-255)",
                arrayDecl: "int ledPins__________ = {4, 5, 12, 13, 14};",
                libHeader: "ESP8266WiFi.h",
                libBody: "",
                libHint: "คำสั่งเรียกใช้งานไลบรารี Wi-Fi ของ ESP8266 (ขึ้นต้นด้วย #)"
            },
            esp32: {
                subtitle: "ฝึกเติม code ESP32 ในช่องว่าง",
                pins: [4, 13, 14, 16, 17, 18, 19, 23, 25, 26, 27, 32, 33],
                ledPin: 18,
                buttonPin: 19,
                pwmPin: 18,
                baudRate: 115200,
                highVoltageHint: "สั่งจ่ายไฟ 3.3V (พิมพ์ใหญ่ทั้งหมด)",
                lowVoltageHint: "สั่งตัดไฟ 0V (พิมพ์ใหญ่ทั้งหมด)",
                stringExample: "ESP32",
                analogPin: "34",
                analogMax: 4095,
                analogComment: "// อ่านค่าอนาล็อก 0-4095 (12-bit)",
                analogHint: "อ่านค่าอนาล็อกจากขา ADC1 ของ ESP32 (เช่น GPIO 34, 35, 36, 39)",
                pwmComment: "// สั่งจ่ายไฟ PWM ครึ่งหนึ่ง (ESP32 Core v2+)",
                pwmHint: "สั่งจ่ายสัญญาณ PWM (ค่า 0-255, ESP32 Core v2+ รองรับเหมือน Arduino)",
                mapHint: "ฟังก์ชันแปลงช่วงค่า (แปลงค่า ADC 0-4095 ของ ESP32 เป็น 0-255)",
                arrayDecl: "int ledPins__________ = {4, 13, 14, 18, 19};",
                libHeader: "WiFi.h",
                libBody: "",
                libHint: "คำสั่งเรียกใช้งานไลบรารี Wi-Fi ของ ESP32 (ขึ้นต้นด้วย #)"
            }
        };

        function getCurrentBoard() {
            const boardSelect = document.getElementById("board-select");
            return boardSelect && BOARD_CONFIG[boardSelect.value] ? boardSelect.value : "all";
        }

        function getBoardConfig() {
            return BOARD_CONFIG[getCurrentBoard()];
        }

        function updateBoardSubtitle(board) {
            const cfg = BOARD_CONFIG[board] || BOARD_CONFIG.all;
            const subtitleEl = document.getElementById("board-subtitle");
            if (subtitleEl) {
                subtitleEl.textContent = cfg.subtitle;
            }
        }

        function changeBoard() {
            const board = getCurrentBoard();
            updateBoardSubtitle(board);

            if (currentQuestionStatus === "unattempted") {
                currentQuestionStatus = "completed"; // ป้องกันการนับเป็นข้ามเมื่อสลับบอร์ด
            }
            nextQuestion();
        }

        function changeLevel() {
            const level = document.getElementById("level-select").value;
            const focusContainer = document.getElementById("focus-switch-container");
            const focusToggle = document.getElementById("focus-toggle");
            
            if (level === "1") {
                focusContainer.style.opacity = "0.3";
                focusToggle.disabled = true;
            } else {
                focusContainer.style.opacity = "1";
                focusToggle.disabled = false;
            }

            // รีเซ็ตคะแนนและเริ่มสุ่มข้อใหม่ของระดับนั้น
            scoreCorrect = 0;
            scoreIncorrect = 0;
            scoreSkipped = 0;
            currentQuestionStatus = "completed"; // ป้องกันการติดสถานะข้าม
            updateScoreUI();
            nextQuestion();
        }

        function generateRandomQuestion() {
            const level = document.getElementById("level-select").value;
            const isFocus = document.getElementById("focus-toggle").checked;
            
            let questionTypes = level1Types;
            if (level === "2") {
                if (isFocus) {
                    questionTypes = level2Types;
                } else {
                    questionTypes = level1Types.concat(level2Types);
                }
            } else if (level === "3") {
                if (isFocus) {
                    questionTypes = level3Types;
                } else {
                    questionTypes = level1Types.concat(level2Types, level3Types);
                }
            } else if (level === "4") {
                if (isFocus) {
                    questionTypes = level4Types;
                } else {
                    questionTypes = level1Types.concat(level2Types, level3Types, level4Types);
                }
            } else if (level === "5") {
                if (isFocus) {
                    questionTypes = level5Types;
                } else {
                    questionTypes = level1Types.concat(level2Types, level3Types, level4Types, level5Types);
                }
            } else if (level === "6") {
                if (isFocus) {
                    questionTypes = level6Types;
                } else {
                    questionTypes = level1Types.concat(level2Types, level3Types, level4Types, level5Types, level6Types);
                }
            } else if (level === "7") {
                if (isFocus) {
                    questionTypes = level7Types;
                } else {
                    questionTypes = level1Types.concat(level2Types, level3Types, level4Types, level5Types, level6Types, level7Types);
                }
            } else if (level === "8") {
                if (isFocus) {
                    questionTypes = level8Types;
                } else {
                    questionTypes = level1Types.concat(level2Types, level3Types, level4Types, level5Types, level6Types, level7Types, level8Types);
                }
            } else if (level === "9") {
                if (isFocus) {
                    questionTypes = level9Types;
                } else {
                    questionTypes = level1Types.concat(level2Types, level3Types, level4Types, level5Types, level6Types, level7Types, level8Types, level9Types);
                }
            } else if (level === "10") {
                if (isFocus) {
                    questionTypes = level10Types;
                } else {
                    questionTypes = level1Types.concat(level2Types, level3Types, level4Types, level5Types, level6Types, level7Types, level8Types, level9Types, level10Types);
                }
            }
            
            let type;
            do {
                type = questionTypes[Math.floor(Math.random() * questionTypes.length)];
            } while (type === lastQuestionType && questionTypes.length > 1);
            
            lastQuestionType = type;
            
            const cfg = getBoardConfig();

            // สุ่มขาพินที่ปลอดภัยตามบอร์ดที่เลือก
            function getRandomPin() {
                return cfg.pins[Math.floor(Math.random() * cfg.pins.length)];
            }
            
            let template = "";
            let answer = "";
            let hint = "";
            
            switch (type) {
                case "setup":
                    template = "void __________() {\n  // ทำงานรอบเดียวตอนเปิดเครื่อง\n}\n\nvoid loop() {\n  // ทำงานวนซ้ำไปเรื่อยๆ\n}";
                    answer = "setup";
                    hint = "บล็อกตั้งค่าเริ่มต้น";
                    break;
                case "loop":
                    template = "void setup() {\n  // ทำงานรอบเดียวตอนเปิดเครื่อง\n}\n\nvoid __________() {\n  // ทำงานวนซ้ำไปเรื่อยๆ\n}";
                    answer = "loop";
                    hint = "บล็อกการทำงานหลัก";
                    break;
                case "serial_begin_serial":
                    template = "void setup() {\n  __________.begin(" + cfg.baudRate + ");\n}\n\nvoid loop() {\n  \n}";
                    answer = "Serial";
                    hint = "หน้าจอตรวจสอบอนุกรม (ขึ้นต้นด้วยตัวพิมพ์ใหญ่)";
                    break;
                case "serial_begin_begin":
                    template = "void setup() {\n  Serial.__________(" + cfg.baudRate + ");\n}\n\nvoid loop() {\n  \n}";
                    answer = "begin";
                    hint = "คำสั่งเปิดท่อสื่อสาร";
                    break;
                case "delay":
                    const ms = [100, 500, 1000, 2000, 5000][Math.floor(Math.random() * 5)];
                    template = "void setup() {\n  \n}\n\nvoid loop() {\n  __________(" + ms + ");\n}";
                    answer = "delay";
                    hint = "คำสั่งหน่วงเวลาเป็นมิลลิวินาที";
                    break;
                case "serial_print_serial":
                    template = "void setup() {\n  Serial.begin(" + cfg.baudRate + ");\n}\n\nvoid loop() {\n  __________.print(\"Hello\");\n}";
                    answer = "Serial";
                    hint = "หน้าจอตรวจสอบอนุกรม (ขึ้นต้นด้วยตัวพิมพ์ใหญ่)";
                    break;
                case "serial_print_print":
                    template = "void setup() {\n  Serial.begin(" + cfg.baudRate + ");\n}\n\nvoid loop() {\n  Serial.__________(\"Hello\");\n}";
                    answer = "print";
                    hint = "พิมพ์ข้อความออกจอ (ไม่ขึ้นบรรทัดใหม่)";
                    break;
                case "serial_println_serial":
                    template = "void setup() {\n  Serial.begin(" + cfg.baudRate + ");\n}\n\nvoid loop() {\n  __________.println(\"World\");\n}";
                    answer = "Serial";
                    hint = "หน้าจอตรวจสอบอนุกรม (ขึ้นต้นด้วยตัวพิมพ์ใหญ่)";
                    break;
                case "serial_println_println":
                    template = "void setup() {\n  Serial.begin(" + cfg.baudRate + ");\n}\n\nvoid loop() {\n  Serial.__________(\"World\");\n}";
                    answer = "println";
                    hint = "พิมพ์ข้อความออกจอ (พร้อมขึ้นบรรทัดใหม่)";
                    break;
                case "pinmode_cmd":
                    const pin1 = getRandomPin();
                    const modes1 = ["INPUT", "OUTPUT"];
                    const mode1 = modes1[Math.floor(Math.random() * modes1.length)];
                    template = "void setup() {\n  __________(" + pin1 + ", " + mode1 + ");\n}\n\nvoid loop() {\n  \n}";
                    answer = "pinMode";
                    hint = "คำสั่งตั้งค่าโหมดของขาพิน";
                    break;
                case "pinmode_mode":
                    const pin2 = getRandomPin();
                    const modes2 = ["INPUT", "OUTPUT"];
                    const mode2 = modes2[Math.floor(Math.random() * modes2.length)];
                    template = "void setup() {\n  pinMode(" + pin2 + ", __________);\n}\n\nvoid loop() {\n  \n}";
                    answer = mode2;
                    hint = mode2 === "INPUT" ? "ตั้งขาให้เป็นผู้รับสัญญาณ (พิมพ์ใหญ่ทั้งหมด)" : "ตั้งขาให้เป็นผู้จ่ายไฟออก (พิมพ์ใหญ่ทั้งหมด)";
                    break;
                case "digitalwrite_cmd":
                    const pin3 = getRandomPin();
                    const states1 = ["HIGH", "LOW"];
                    const state1 = states1[Math.floor(Math.random() * states1.length)];
                    template = "void setup() {\n  pinMode(" + pin3 + ", OUTPUT);\n}\n\nvoid loop() {\n  __________(" + pin3 + ", " + state1 + ");\n}";
                    answer = "digitalWrite";
                    hint = "คำสั่งสั่งจ่ายไฟหรือตัดไฟของขาดิจิทัล";
                    break;
                case "digitalwrite_state":
                    const pin4 = getRandomPin();
                    const states2 = ["HIGH", "LOW"];
                    const state2 = states2[Math.floor(Math.random() * states2.length)];
                    template = "void setup() {\n  pinMode(" + pin4 + ", OUTPUT);\n}\n\nvoid loop() {\n  digitalWrite(" + pin4 + ", __________);\n}";
                    answer = state2;
                    hint = state2 === "HIGH" ? cfg.highVoltageHint : cfg.lowVoltageHint;
                    break;
                case "var_int":
                    const numInt = Math.floor(Math.random() * 100);
                    template = "__________ score = " + numInt + ";\n\nvoid setup() {\n  \n}\n\nvoid loop() {\n  \n}";
                    answer = "int";
                    hint = "ชนิดตัวแปรเก็บค่าจำนวนเต็ม";
                    break;
                case "var_float":
                    const numFloat = (Math.random() * 100).toFixed(2);
                    template = "__________ temp = " + numFloat + ";\n\nvoid setup() {\n  \n}\n\nvoid loop() {\n  \n}";
                    answer = "float";
                    hint = "ชนิดตัวแปรเก็บค่าตัวเลขทศนิยม";
                    break;
                case "var_string":
                    template = "__________ name = \"" + cfg.stringExample + "\";\n\nvoid setup() {\n  \n}\n\nvoid loop() {\n  \n}";
                    answer = "String";
                    hint = "ชนิดตัวแปรเก็บข้อความยาวๆ (ตัวอักษรแรกพิมพ์ใหญ่)";
                    break;
                case "var_bool":
                    const boolVals = ["true", "false"];
                    const bVal = boolVals[Math.floor(Math.random() * 2)];
                    template = "__________ status = " + bVal + ";\n\nvoid setup() {\n  \n}\n\nvoid loop() {\n  \n}";
                    answer = "bool";
                    hint = "ชนิดตัวแปรเก็บค่าความจริง (true หรือ false)";
                    break;
                case "var_char":
                    template = "__________ grade = 'A';\n\nvoid setup() {\n  \n}\n\nvoid loop() {\n  \n}";
                    answer = "char";
                    hint = "ชนิดตัวแปรเก็บตัวอักษรเพียง 1 ตัว";
                    break;
                case "const_int":
                    const pC = getRandomPin();
                    template = "__________ int ledPin = " + pC + "; // ห้ามแก้ไขค่าพิน\n\nvoid setup() {\n  \n}\n\nvoid loop() {\n  \n}";
                    answer = "const";
                    hint = "กำหนดให้ตัวแปรมีค่าคงที่ เปลี่ยนแปลงไม่ได้";
                    break;
                case "define_pin":
                    const pD = getRandomPin();
                    template = "#__________ BUTTON_PIN " + pD + "\n\nvoid setup() {\n  \n}\n\nvoid loop() {\n  \n}";
                    answer = "define";
                    hint = "กำหนดค่าคงที่แบบ Macro (ไม่มีเครื่องหมาย ; ต่อท้าย)";
                    break;
                case "math_inc":
                    template = "int count = 0;\n\nvoid setup() {\n  \n}\n\nvoid loop() {\n  count__________; // เพิ่มค่า count ทีละ 1\n}";
                    answer = "++";
                    hint = "เครื่องหมายเพิ่มค่าทีละ 1";
                    break;
                case "math_dec":
                    template = "int timer = 10;\n\nvoid setup() {\n  \n}\n\nvoid loop() {\n  timer__________; // ลดค่า timer ทีละ 1\n}";
                    answer = "--";
                    hint = "เครื่องหมายลดค่าทีละ 1";
                    break;
                case "math_mod":
                    template = "void setup() {\n  \n}\n\nvoid loop() {\n  int remain = 10 __________ 3; // หารเอาเศษ ได้ 1\n}";
                    answer = "%";
                    hint = "เครื่องหมายหารเอาเศษ (Modulo)";
                    break;
                case "compare_eq":
                    template = "void setup() {\n  \n}\n\nvoid loop() {\n  if (score __________ 100) {\n    // ทำงานเมื่อคะแนนเท่ากับ 100\n  }\n}";
                    answer = "==";
                    hint = "เครื่องหมายเปรียบเทียบความเท่ากัน (ใช้ 2 ตัวติดกัน)";
                    break;
                case "compare_neq":
                    template = "void setup() {\n  \n}\n\nvoid loop() {\n  if (status __________ 0) {\n    // ทำงานเมื่อสถานะไม่เท่ากับ 0\n  }\n}";
                    answer = "!=";
                    hint = "เครื่องหมายเปรียบเทียบความไม่เท่ากัน";
                    break;
                case "if_cond":
                    template = "void loop() {\n  __________ (sensorValue > 500) {\n    digitalWrite(" + cfg.ledPin + ", HIGH);\n  }\n}";
                    answer = "if";
                    hint = "คำสั่งเช็คเงื่อนไข (ถ้า...)";
                    break;
                case "else_cond":
                    template = "void loop() {\n  if (sensorValue > 500) {\n    digitalWrite(" + cfg.ledPin + ", HIGH);\n  } __________ {\n    digitalWrite(" + cfg.ledPin + ", LOW);\n  }\n}";
                    answer = "else";
                    hint = "คำสั่งทำงานเมื่อเงื่อนไขแรกไม่เป็นจริง (มิฉะนั้น...)";
                    break;
                case "else_if_cond":
                    template = "void loop() {\n  if (score >= 80) {\n    // เกรด A\n  } __________ (score >= 70) {\n    // เกรด B\n  }\n}";
                    answer = "else if";
                    hint = "คำสั่งเช็คเงื่อนไขถัดไป (เว้นวรรค 1 ช่อง)";
                    break;
                case "for_loop":
                    template = "void setup() {\n  __________ (int i = 0; i < 5; i++) {\n    // ทำงาน 5 รอบ\n  }\n}\n\nvoid loop() {\n  \n}";
                    answer = "for";
                    hint = "คำสั่งวนลูปแบบรู้จำนวนรอบที่แน่นอน";
                    break;
                case "while_loop":
                    template = "void setup() {\n  \n}\n\nvoid loop() {\n  __________ (digitalRead(" + cfg.buttonPin + ") == HIGH) {\n    // วนลูปตราบใดที่ปุ่มยังถูกกดอยู่\n  }\n}";
                    answer = "while";
                    hint = "คำสั่งวนลูปตราบใดที่เงื่อนไขยังเป็นจริง";
                    break;
                case "digital_read":
                    const pR = getRandomPin();
                    template = "void setup() {\n  pinMode(" + pR + ", INPUT);\n}\n\nvoid loop() {\n  int val = __________(" + pR + ");\n}";
                    answer = "digitalRead";
                    hint = "อ่านค่าสถานะดิจิทัลจากขาพิน (HIGH/LOW)";
                    break;
                case "analog_read":
                    template = "void setup() {\n  \n}\n\nvoid loop() {\n  int val = __________(" + cfg.analogPin + "); " + cfg.analogComment + "\n}";
                    answer = "analogRead";
                    hint = cfg.analogHint;
                    break;
                case "analog_write":
                    template = "void setup() {\n  pinMode(" + cfg.pwmPin + ", OUTPUT);\n}\n\nvoid loop() {\n  __________(" + cfg.pwmPin + ", 128); " + cfg.pwmComment + "\n}";
                    answer = "analogWrite";
                    hint = cfg.pwmHint;
                    break;
                case "func_void":
                    template = "__________ turnOnLed() {\n  digitalWrite(" + cfg.ledPin + ", HIGH);\n}\n\nvoid setup() {\n  \n}\n\nvoid loop() {\n  turnOnLed();\n}";
                    answer = "void";
                    hint = "ชนิดฟังก์ชันที่ไม่ต้องส่งค่ากลับ";
                    break;
                case "func_return":
                    template = "int getDouble(int x) {\n  __________ x * 2;\n}\n\nvoid setup() {\n  \n}\n\nvoid loop() {\n  \n}";
                    answer = "return";
                    hint = "คำสั่งส่งคืนค่าออกจากฟังก์ชัน";
                    break;
                case "logic_and":
                    template = "void loop() {\n  if (temp > 30 __________ humidity > 70) {\n    // ทำงานเมื่อร้อน และ ชื้น\n  }\n}";
                    answer = "&&";
                    hint = "เครื่องหมาย 'และ' (ต้องจริงทั้งคู่)";
                    break;
                case "logic_or":
                    template = "void loop() {\n  if (day == 6 __________ day == 7) {\n    // ทำงานเมื่อเป็นวันเสาร์ หรือ วันอาทิตย์\n  }\n}";
                    answer = "||";
                    hint = "เครื่องหมาย 'หรือ' (ขีดตั้ง 2 ตัว)";
                    break;
                case "logic_not":
                    template = "void loop() {\n  if (__________isReady) {\n    // ทำงานเมื่อ isReady มีค่าเป็น false (ไม่พร้อม)\n  }\n}";
                    answer = "!";
                    hint = "เครื่องหมาย 'ไม่' (สลับค่าความจริง)";
                    break;
                case "time_millis":
                    template = "void setup() {\n  \n}\n\nvoid loop() {\n  unsigned long currentMillis = __________();\n}";
                    answer = "millis";
                    hint = "ฟังก์ชันคืนค่าเวลาเป็นมิลลิวินาทีตั้งแต่เปิดบอร์ด";
                    break;
                case "math_map":
                    template = "void loop() {\n  int val = analogRead(" + cfg.analogPin + ");\n  int pwmVal = __________(val, 0, " + cfg.analogMax + ", 0, 255);\n  analogWrite(" + cfg.pwmPin + ", pwmVal);\n}";
                    answer = "map";
                    hint = cfg.mapHint;
                    break;
                case "math_random":
                    template = "void loop() {\n  int r = __________(1, 7); // สุ่มเลข 1 ถึง 6\n}";
                    answer = "random";
                    hint = "ฟังก์ชันสุ่มตัวเลข";
                    break;
                case "switch_cmd":
                    template = "void loop() {\n  char key = 'A';\n  __________(key) {\n    case 'A':\n      break;\n  }\n}";
                    answer = "switch";
                    hint = "คำสั่งเลือกทำงานตามค่าของตัวแปร (ใช้คู่กับ case)";
                    break;
                case "case_cmd":
                    template = "void loop() {\n  int menu = 1;\n  switch(menu) {\n    __________ 1:\n      // ทำงานเมนู 1\n      break;\n  }\n}";
                    answer = "case";
                    hint = "ระบุเงื่อนไขในคำสั่ง switch";
                    break;
                case "break_cmd":
                    template = "void loop() {\n  switch(state) {\n    case 0:\n      turnOff();\n      __________; // หยุดและออกจาก switch\n  }\n}";
                    answer = "break";
                    hint = "คำสั่งหยุดและกระโดดออกจากลูปหรือ switch";
                    break;
                case "array_declare":
                    template = cfg.arrayDecl + "\n\nvoid setup() {\n  \n}";
                    answer = "[5]";
                    hint = "กำหนดขนาดของอาร์เรย์ (ใส่วงเล็บเหลี่ยมและเลข 5)";
                    break;
                case "include_lib":
                    template = "__________ <" + cfg.libHeader + ">" + cfg.libBody + "\n\nvoid setup() {\n  \n}";
                    answer = "#include";
                    hint = cfg.libHint;
                    break;
            }
            return { template, answer, hint };
        }

        function nextQuestion() {
            if (currentAnswer !== "") {
                if (currentQuestionStatus !== "completed") {
                    finalizeCurrentQuestion();
                }
            }
            currentQuestionStatus = "unattempted";

            // สุ่มโจทย์ใหม่ไม่จำกัด
            const q = generateRandomQuestion();
            currentAnswer = q.answer;
            currentHint = q.hint;
            
            // แทนที่ช่องว่างด้วย Input Field
            const htmlCode = q.template.replace("__________", "<input type='text' id='userInput' autocomplete='off' onkeypress='handleEnter(event)'>");
            
            document.getElementById("code-display").innerHTML = htmlCode;
            document.getElementById("feedback").innerHTML = `<span style="color: #888; font-size: 0.9rem;">คำใบ้: ${currentHint}</span>`;
            
            // Auto Focus ที่ช่องเติมคำ
            setTimeout(() => document.getElementById("userInput").focus(), 100);
            syncStateToRemote();
        }

        function checkAnswer() {
            if (currentQuestionStatus === "completed") return;

            const userInputEl = document.getElementById("userInput");
            const userVal = userInputEl.value.trim();
            const feedbackBox = document.getElementById("feedback");
            
            if (userVal === currentAnswer) {
                feedbackBox.innerHTML = "<span class='correct'>✅ โคตรเป๊ะ! ไปลุยข้อต่อไปเลย</span>";
                currentQuestionStatus = "correct";
                finalizeCurrentQuestion();
                userInputEl.disabled = true;
            } else {
                currentQuestionStatus = "wrong";
                finalizeCurrentQuestion();
                userInputEl.disabled = true;
                
                // แจ้งเตือนและเฉลยคำตอบที่ถูกต้อง
                if (userVal.toLowerCase() === currentAnswer.toLowerCase()) {
                    feedbackBox.innerHTML = `<span class='incorrect'>❌ ผิดตัวพิมพ์เล็ก-ใหญ่! คำตอบที่ถูกต้องคือ <strong>${currentAnswer}</strong></span>`;
                } else {
                    feedbackBox.innerHTML = `<span class='incorrect'>❌ ผิดจ้า! คำตอบที่ถูกต้องคือ <strong>${currentAnswer}</strong></span>`;
                }
            }
            syncStateToRemote();
        }

        function handleEnter(e) {
            if(e.key === 'Enter') checkAnswer();
        }

        function restartGame() {
            Swal.fire({
                title: 'เริ่มใหม่?',
                text: "คะแนนปัจจุบันจะถูกรีเซ็ตทั้งหมด!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#ff9800',
                cancelButtonColor: '#555',
                confirmButtonText: 'ใช่, เริ่มเลย!',
                cancelButtonText: 'ยกเลิก',
                background: '#2d2d2d',
                color: '#d4d4d4'
            }).then((result) => {
                if (result.isConfirmed) {
                    scoreCorrect = 0;
                    scoreIncorrect = 0;
                    scoreSkipped = 0;
                    currentQuestionStatus = "completed";
                    updateScoreUI();
                    nextQuestion();
                    syncStateToRemote();
                }
            });
        }

        function revealAnswerOnScreen() {
            if (currentQuestionStatus === "completed") return;

            const userInputEl = document.getElementById("userInput");
            const feedbackBox = document.getElementById("feedback");

            currentQuestionStatus = "wrong";
            finalizeCurrentQuestion();

            if (userInputEl) {
                userInputEl.value = currentAnswer;
                userInputEl.disabled = true;
            }

            if (feedbackBox) {
                feedbackBox.innerHTML = `<span class='incorrect'>💡 เฉลย: คำตอบที่ถูกต้องคือ <strong>${currentAnswer}</strong></span>`;
            }

            syncStateToRemote();
        }

        // ==========================================
        // Remote Control & Live Teaching Sync
        // ==========================================
        function syncStateToRemote() {
            if (!isTeachingMode || !window.location.protocol.startsWith("http")) return;

            const codeDisplayEl = document.getElementById("code-display");
            const boardSelect = document.getElementById("board-select");
            const levelSelect = document.getElementById("level-select");
            const focusToggle = document.getElementById("focus-toggle");
            const userInputEl = document.getElementById("userInput");

            const state = {
                gameTitle: "Arduino-ESP-Master",
                questionText: codeDisplayEl ? codeDisplayEl.innerText.trim() : "",
                correctAnswer: currentAnswer,
                hint: currentHint,
                scoreCorrect: scoreCorrect,
                scoreIncorrect: scoreIncorrect,
                scoreSkipped: scoreSkipped,
                totalQuestions: scoreCorrect + scoreIncorrect + scoreSkipped,
                status: currentQuestionStatus,
                isAnswered: currentQuestionStatus !== "unattempted",
                board: boardSelect ? boardSelect.value : "all",
                level: levelSelect ? levelSelect.value : "1",
                focus: focusToggle ? focusToggle.checked : false,
                inputValue: userInputEl ? userInputEl.value : ""
            };

            fetch("/api/state", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(state),
            }).catch(() => {});
        }

        function handleRemoteAction(data) {
            if (data.action === "request_state") {
                syncStateToRemote();
                return;
            }

            if (data.action === "click") {
                if (data.target === "reveal-btn" || data.target === "reveal-c-btn" || data.target === "reveal_on_screen") {
                    const userInputEl = document.getElementById("userInput");
                    if (userInputEl) {
                        userInputEl.value = currentAnswer;
                    }
                    if (currentQuestionStatus === "unattempted") {
                        checkAnswer();
                    }
                    syncStateToRemote();
                } else if (data.target === "check-btn" || data.target === "btn-check" || data.target === "main-action-btn") {
                    const el = document.getElementById("btn-check");
                    if (el) {
                        el.classList.add("remote-click-active");
                        setTimeout(() => el.classList.remove("remote-click-active"), 250);
                    }
                    if (currentQuestionStatus === "unattempted") {
                        checkAnswer();
                    } else {
                        nextQuestion();
                    }
                    syncStateToRemote();
                } else if (data.target === "next-btn" || data.target === "btn-next") {
                    const el = document.getElementById("btn-next");
                    if (el) {
                        el.classList.add("remote-click-active");
                        setTimeout(() => el.classList.remove("remote-click-active"), 250);
                    }
                    nextQuestion();
                    syncStateToRemote();
                } else if (data.target === "restart_game" || data.target === "restart-btn" || data.target === "btn-restart") {
                    scoreCorrect = 0;
                    scoreIncorrect = 0;
                    scoreSkipped = 0;
                    currentQuestionStatus = "completed";
                    updateScoreUI();
                    nextQuestion();
                    syncStateToRemote();
                } else {
                    const el = document.getElementById(data.target);
                    if (el) {
                        el.classList.add("remote-click-active");
                        setTimeout(() => el.classList.remove("remote-click-active"), 250);
                        el.click();
                    }
                }
            } else if (data.action === "set_board") {
                const boardSelect = document.getElementById("board-select");
                if (boardSelect && data.value && BOARD_CONFIG[data.value] && boardSelect.value !== data.value) {
                    boardSelect.value = data.value;
                    changeBoard();
                }
            } else if (data.action === "set_level") {
                const levelSelect = document.getElementById("level-select");
                if (levelSelect && data.value && levelSelect.value !== data.value) {
                    levelSelect.value = data.value;
                    changeLevel();
                }
            } else if (data.action === "toggle_focus") {
                const focusToggle = document.getElementById("focus-toggle");
                if (focusToggle) {
                    focusToggle.checked = !focusToggle.checked;
                    changeLevel();
                }
            }
        }

        function updateClientCountUI(count) {
            const remoteCountBadge = document.getElementById("remote-badge-count");
            const remotePillText = document.getElementById("remote-pill-text");
            const modalStatusText = document.getElementById("modal-status-text");
            const modalStatusDot = document.getElementById("modal-status-dot");

            const remoteDevices = Math.max(0, count - 1);

            if (remoteCountBadge) {
                remoteCountBadge.textContent = remoteDevices;
                remoteCountBadge.className = remoteDevices > 0 ? "badge bg-success ms-1" : "badge bg-secondary ms-1";
            }

            if (remotePillText) {
                remotePillText.textContent = remoteDevices > 0 ? `รีโมท: ${remoteDevices} เครื่อง 🟢` : "รีโมทมือถือ (Remote)";
            }

            if (modalStatusText) {
                if (remoteDevices > 0) {
                    modalStatusText.textContent = `เชื่อมต่อแล้ว ${remoteDevices} เครื่อง (พร้อมควบคุมระยะไกล)`;
                    if (modalStatusDot) modalStatusDot.className = "fas fa-circle text-success me-2 fs-6";
                } else {
                    modalStatusText.textContent = "ยังไม่มีเครื่องเชื่อมต่อ (รอสแกน QR Code)";
                    if (modalStatusDot) modalStatusDot.className = "fas fa-circle text-muted me-2 fs-6";
                }
            }
        }

        function initRemoteSSE() {
            if (eventSource) return;

            eventSource = new EventSource("/api/events");

            eventSource.onopen = () => {
                syncStateToRemote();
            };

            eventSource.onerror = () => {
                // EventSource auto reconnects
            };

            eventSource.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.type === "action") {
                        handleRemoteAction(data);
                    } else if (data.type === "client_count") {
                        updateClientCountUI(data.count);
                    }
                } catch (err) {
                    console.error("SSE parse error:", err);
                }
            };
        }

        function populateServerInfo(info) {
            const urlTs = document.getElementById("url-tailscale");
            const urlWifi = document.getElementById("url-wifi");
            const qrTs = document.getElementById("qr-img-tailscale");
            const qrWifi = document.getElementById("qr-img-wifi");

            if (urlTs && info.tailscale_url) {
                urlTs.value = info.tailscale_url;
            } else if (urlTs) {
                urlTs.value = "ไม่พบ Tailscale IP (โปรดตรวจสอบการเปิด Tailscale)";
            }

            if (urlWifi && info.wifi_url) {
                urlWifi.value = info.wifi_url;
            } else if (urlWifi) {
                urlWifi.value = info.local_url + "/remote";
            }

            if (qrTs && info.tailscale_url) {
                qrTs.src = "/api/qrcode?target=tailscale";
                qrTs.style.display = "block";
            }
            if (qrWifi && info.wifi_url) {
                qrWifi.src = "/api/qrcode?target=wifi";
                qrWifi.style.display = "block";
            }

            if (info.connected_clients !== undefined) {
                updateClientCountUI(info.connected_clients);
            }

            setupCopyButtons();
        }

        function setupCopyButtons() {
            const btnTs = document.getElementById("btn-copy-tailscale");
            const btnWifi = document.getElementById("btn-copy-wifi");

            if (btnTs) {
                btnTs.onclick = () => {
                    const input = document.getElementById("url-tailscale");
                    if (input && input.value) {
                        navigator.clipboard.writeText(input.value);
                        btnTs.innerHTML = '<i class="fas fa-check text-success"></i>';
                        setTimeout(() => (btnTs.innerHTML = '<i class="fas fa-copy"></i>'), 1500);
                    }
                };
            }

            if (btnWifi) {
                btnWifi.onclick = () => {
                    const input = document.getElementById("url-wifi");
                    if (input && input.value) {
                        navigator.clipboard.writeText(input.value);
                        btnWifi.innerHTML = '<i class="fas fa-check text-success"></i>';
                        setTimeout(() => (btnWifi.innerHTML = '<i class="fas fa-copy"></i>'), 1500);
                    }
                };
            }
        }

        // Fullscreen button toggle
        const btnFullscreen = document.getElementById("btn-fullscreen");
        if (btnFullscreen) {
            btnFullscreen.addEventListener("click", () => {
                if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen().catch(() => {});
                    btnFullscreen.innerHTML = '<i class="fas fa-compress"></i>';
                } else {
                    document.exitFullscreen().catch(() => {});
                    btnFullscreen.innerHTML = '<i class="fas fa-expand"></i>';
                }
            });

            document.addEventListener("fullscreenchange", () => {
                if (!document.fullscreenElement) {
                    btnFullscreen.innerHTML = '<i class="fas fa-expand"></i>';
                } else {
                    btnFullscreen.innerHTML = '<i class="fas fa-compress"></i>';
                }
            });
        }

        function enableTeachingMode(info) {
            isTeachingMode = true;

            const teacherBar = document.getElementById("teacher-control-bar");
            if (teacherBar) {
                teacherBar.classList.remove("d-none");
                teacherBar.classList.add("d-flex");
            }

            populateServerInfo(info);
            initRemoteSSE();
            syncStateToRemote();
        }

        function detectPythonServer() {
            const hostname = window.location.hostname;
            const isStaticHost =
                window.location.protocol === "file:" ||
                hostname.endsWith("github.io") ||
                hostname.includes("github.io");

            if (isStaticHost) {
                return;
            }

            fetch("/api/info", { cache: "no-store" })
                .then((res) => {
                    if (res.ok) return res.json();
                    throw new Error("Not run_server.py");
                })
                .then((info) => {
                    if (info && info.port) {
                        enableTeachingMode(info);
                    }
                })
                .catch(() => {});
        }

        // เริ่มเกมข้อแรกและตรวจจับ Server
        updateBoardSubtitle(getCurrentBoard());
        nextQuestion();
        detectPythonServer();
