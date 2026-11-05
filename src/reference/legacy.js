    const TOKENS = {
      RESERVA: 'TOKEN_RESERVA',
      CLIENTE: 'TOKEN_CLIENTE',
      HABITACION: 'TOKEN_HABITACION',
      FECHA: 'TOKEN_FECHA',
      NOCHES: 'TOKEN_NOCHES',
      PERSONAS: 'TOKEN_PERSONAS',
      IGUAL: 'TOKEN_IGUAL',
      HAB_ID: 'TOKEN_HAB_ID',
      FECHA_VAL: 'TOKEN_FECHA_VAL',
      ENTERO: 'TOKEN_ENTERO',
      IDENTIFICADOR: 'TOKEN_IDENTIFICADOR',
      ERROR: 'TOKEN_ERROR',
      EOF: 'TOKEN_EOF'
    };

    const KEYWORDS = {
      'RESERVA': TOKENS.RESERVA,
      'CLIENTE': TOKENS.CLIENTE,
      'HABITACION': TOKENS.HABITACION,
      'FECHA': TOKENS.FECHA,
      'NOCHES': TOKENS.NOCHES,
      'PERSONAS': TOKENS.PERSONAS
    };

    class Lexer {
      constructor(input) {
        this.input = input.trim();
        this.position = 0;
        this.tokens = [];
        this.errors = [];
      }

      tokenize() {
        const length = this.input.length;

        while (this.position < length) {
          const char = this.input[this.position];

          if (/\s/.test(char)) {
            this.position++;
            continue;
          }

          if (char === '=') {
            this.tokens.push({
              type: TOKENS.IGUAL,
              value: '=',
              category: 'Operador Asignación',
              pos: this.position
            });
            this.position++;
            continue;
          }

          const remaining = this.input.slice(this.position);

          const dateMatch = remaining.match(/^(\d{4}-\d{2}-\d{2})\b/);
          if (dateMatch) {
            const val = dateMatch[1];
            this.tokens.push({
              type: TOKENS.FECHA_VAL,
              value: val,
              category: 'Valor de Fecha ISO',
              pos: this.position
            });
            this.position += val.length;
            continue;
          }

          const roomMatch = remaining.match(/^(H\d{3})\b/);
          if (roomMatch) {
            const val = roomMatch[1];
            this.tokens.push({
              type: TOKENS.HAB_ID,
              value: val,
              category: 'Código Habitación',
              pos: this.position
            });
            this.position += val.length;
            continue;
          }

          const intMatch = remaining.match(/^(\d+)\b/);
          if (intMatch) {
            const val = intMatch[1];
            this.tokens.push({
              type: TOKENS.ENTERO,
              value: val,
              category: 'Constante Entera',
              pos: this.position
            });
            this.position += val.length;
            continue;
          }

          const wordMatch = remaining.match(/^([A-Za-z0-9_]+)\b/);
          if (wordMatch) {
            const word = wordMatch[1];
            const upperWord = word.toUpperCase();

            if (KEYWORDS[upperWord]) {
              this.tokens.push({
                type: KEYWORDS[upperWord],
                value: word,
                category: 'Palabra Reservada',
                pos: this.position
              });
            } else {
              this.tokens.push({
                type: TOKENS.IDENTIFICADOR,
                value: word,
                category: 'Identificador Huésped',
                pos: this.position
              });
            }
            this.position += word.length;
            continue;
          }

          this.tokens.push({
            type: TOKENS.ERROR,
            value: char,
            category: 'Símbolo No Admitido',
            pos: this.position
          });
          this.errors.push({
            char: char,
            pos: this.position,
            message: `Carácter '${char}' no admitido en el alfabeto en la posición ${this.position}.`
          });
          this.position++;
        }

        this.tokens.push({
          type: TOKENS.EOF,
          value: 'EOF',
          category: 'Fin de Entrada',
          pos: this.position
        });

        return {
          tokens: this.tokens,
          errors: this.errors
        };
      }
    }

    class Parser {
      constructor(tokens) {
        this.tokens = tokens;
        this.cursor = 0;
      }

      current() {
        return this.tokens[this.cursor] || { type: TOKENS.EOF, value: 'EOF', pos: -1 };
      }

      match(expectedType, friendlyName) {
        const token = this.current();

        if (token.type === TOKENS.ERROR) {
          throw new Error(`Error Léxico en pos. ${token.pos}: Símbolo inválido '${token.value}'.`);
        }

        if (token.type === expectedType) {
          this.cursor++;
          return token;
        }

        const recib = token.type === TOKENS.EOF ? 'Fin de cadena (EOF)' : `'${token.value}' (${token.type})`;
        throw new Error(`Se esperaba ${friendlyName || expectedType}, pero se encontró ${recib} en la posición ${token.pos}.`);
      }

      parse() {
        if (this.current().type === TOKENS.EOF) {
          throw new Error("La entrada está vacía. Ingrese una sentencia de reserva.");
        }

        const reservaTok = this.match(TOKENS.RESERVA, "la palabra clave 'RESERVA'");

        const clienteKey = this.match(TOKENS.CLIENTE, "la clave 'CLIENTE'");
        const igualCliente = this.match(TOKENS.IGUAL, "el operador '=' para CLIENTE");
        const clienteVal = this.match(TOKENS.IDENTIFICADOR, "un identificador de cliente (ej. CARLOS)");

        const habKey = this.match(TOKENS.HABITACION, "la clave 'HABITACION'");
        const igualHab = this.match(TOKENS.IGUAL, "el operador '=' para HABITACION");
        const habVal = this.match(TOKENS.HAB_ID, "un código de habitación válido (H seguido de 3 números, ej. H203)");

        const fechaKey = this.match(TOKENS.FECHA, "la clave 'FECHA'");
        const igualFecha = this.match(TOKENS.IGUAL, "el operador '=' para FECHA");
        const fechaVal = this.match(TOKENS.FECHA_VAL, "una fecha válida en formato YYYY-MM-DD (ej. 2026-10-15)");

        const nochesKey = this.match(TOKENS.NOCHES, "la clave 'NOCHES'");
        const igualNoches = this.match(TOKENS.IGUAL, "el operador '=' para NOCHES");
        const nochesVal = this.match(TOKENS.ENTERO, "un número entero de noches (ej. 3)");

        const personasKey = this.match(TOKENS.PERSONAS, "la clave 'PERSONAS'");
        const igualPersonas = this.match(TOKENS.IGUAL, "el operador '=' para PERSONAS");
        const personasVal = this.match(TOKENS.ENTERO, "un número entero de personas (ej. 2)");

        if (this.current().type !== TOKENS.EOF) {
          const extra = this.current();
          throw new Error(`Tokens inesperados al final: '${extra.value}' (${extra.type}) en la pos. ${extra.pos}.`);
        }

        return {
          success: true,
          ast: {
            node: "<ProgramaReserva>",
            command: reservaTok.value,
            fields: [
              { node: "<CampoCliente>", keyword: clienteKey.value, operator: igualCliente.value, value: clienteVal.value, tokenType: clienteVal.type },
              { node: "<CampoHabitacion>", keyword: habKey.value, operator: igualHab.value, value: habVal.value, tokenType: habVal.type },
              { node: "<CampoFecha>", keyword: fechaKey.value, operator: igualFecha.value, value: fechaVal.value, tokenType: fechaVal.type },
              { node: "<CampoNoches>", keyword: nochesKey.value, operator: igualNoches.value, value: nochesVal.value, tokenType: nochesVal.type },
              { node: "<CampoPersonas>", keyword: personasKey.value, operator: igualPersonas.value, value: personasVal.value, tokenType: personasVal.type }
            ]
          },
          data: {
            cliente: clienteVal.value,
            habitacion: habVal.value,
            fecha: fechaVal.value,
            noches: nochesVal.value,
            personas: personasVal.value
          }
        };
      }
    }

    function analizarSemantica(data) {
      const errors = [];
      const warnings = [];

      const nochesNum = parseInt(data.noches, 10);
      if (isNaN(nochesNum) || nochesNum <= 0) {
        errors.push(`La cantidad de noches debe ser un número entero mayor a 0 (recibido: ${data.noches}).`);
      } else if (nochesNum > 60) {
        warnings.push(`Estancia prolongada (${nochesNum} noches).`);
      }

      const personasNum = parseInt(data.personas, 10);
      if (isNaN(personasNum) || personasNum <= 0) {
        errors.push(`La cantidad de personas debe ser al menos 1 huésped (recibido: ${data.personas}).`);
      } else if (personasNum > 6) {
        warnings.push(`Ocupación grupal (${personasNum} personas).`);
      }

      const parts = data.fecha.split('-');
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10);
      const d = parseInt(parts[2], 10);

      if (m < 1 || m > 12) {
        errors.push(`Mes inválido (${m}). Debe encontrarse entre 01 y 12.`);
      } else {
        const testDate = new Date(y, m - 1, d);
        if (testDate.getFullYear() !== y || testDate.getMonth() !== (m - 1) || testDate.getDate() !== d) {
          errors.push(`La fecha '${data.fecha}' no existe en el calendario (días no válidos para el mes ${m}).`);
        }
      }

      const floor = parseInt(data.habitacion.charAt(1), 10);
      const roomNum = parseInt(data.habitacion.slice(2), 10);

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
        semanticDetails: {
          piso: floor === 0 ? "Planta Baja" : `Piso ${floor}`,
          pisoNum: floor,
          numero: roomNum,
          nochesInt: nochesNum,
          personasInt: personasNum
        }
      };
    }

    function generarCodigoDestino(data, semDetails) {
      const sql = `-- Código Destino Generado por HotelSys Compiler\nINSERT INTO reservas (\n  cliente_nombre,\n  habitacion_codigo,\n  piso_nivel,\n  habitacion_numero,\n  fecha_llegada,\n  total_noches,\n  total_personas,\n  estado_reserva\n) VALUES (\n  '${data.cliente}',\n  '${data.habitacion}',\n  ${semDetails.pisoNum},\n  ${semDetails.numero},\n  '${data.fecha}',\n  ${semDetails.nochesInt},\n  ${semDetails.personasInt},\n  'CONFIRMADA'\n);`;

      const json = JSON.stringify({
        compiler: "HotelSys Compiler v2.0",
        timestamp: new Date().toISOString(),
        payload: {
          reservationCode: `RES-${semDetails.pisoNum}${semDetails.numero}-${data.cliente}`,
          guest: {
            identifier: data.cliente,
            category: "TITULAR"
          },
          room: {
            code: data.habitacion,
            floor: semDetails.piso,
            door: semDetails.numero
          },
          booking: {
            checkIn: data.fecha,
            nights: semDetails.nochesInt,
            guests: semDetails.personasInt
          },
          status: "ACCEPTED"
        }
      }, null, 2);

      return { sql, json };
    }

    function construirTablaSimbolos(data, semDetails, semValid) {
      return [
        { id: 1, simbolo: data.cliente, tipo: 'VARCHAR(60)', offset: '0x0040', scope: 'Scope_Reserva', valorSem: `Titular Huésped: "${data.cliente}"`, estado: 'Válido' },
        { id: 2, simbolo: data.habitacion, tipo: 'ROOM_ID', offset: '0x0048', scope: 'Scope_Reserva', valorSem: `${semDetails.piso}, Habitación ${semDetails.numero}`, estado: 'Válido' },
        { id: 3, simbolo: data.fecha, tipo: 'DATE_ISO8601', offset: '0x0050', scope: 'Scope_Reserva', valorSem: `Fecha Calendario: ${data.fecha}`, estado: semValid ? 'Válido' : 'Inválido' },
        { id: 4, simbolo: data.noches, tipo: 'INT_POSITIVE', offset: '0x0058', scope: 'Scope_Reserva', valorSem: `${semDetails.nochesInt} noche(s) estancia`, estado: semDetails.nochesInt > 0 ? 'Válido' : 'Inválido' },
        { id: 5, simbolo: data.personas, tipo: 'INT_POSITIVE', offset: '0x0060', scope: 'Scope_Reserva', valorSem: `${semDetails.personasInt} persona(s) ocupación`, estado: semDetails.personasInt > 0 ? 'Válido' : 'Inválido' }
      ];
    }


export {Lexer, Parser, analizarSemantica, generarCodigoDestino};
