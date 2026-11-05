// Generated from grammar/HotelSys.g4 by ANTLR 4.13.2
// jshint ignore: start
import antlr4 from 'antlr4';
import HotelSysListener from './HotelSysListener.js';
import HotelSysVisitor from './HotelSysVisitor.js';

const serializedATN = [4,1,12,41,2,0,7,0,2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,4,
2,5,7,5,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1,1,1,2,1,2,1,2,1,2,
1,3,1,3,1,3,1,3,1,4,1,4,1,4,1,4,1,5,1,5,1,5,1,5,1,5,0,0,6,0,2,4,6,8,10,0,
0,34,0,12,1,0,0,0,2,20,1,0,0,0,4,24,1,0,0,0,6,28,1,0,0,0,8,32,1,0,0,0,10,
36,1,0,0,0,12,13,5,1,0,0,13,14,3,2,1,0,14,15,3,4,2,0,15,16,3,6,3,0,16,17,
3,8,4,0,17,18,3,10,5,0,18,19,5,0,0,1,19,1,1,0,0,0,20,21,5,2,0,0,21,22,5,
7,0,0,22,23,5,11,0,0,23,3,1,0,0,0,24,25,5,3,0,0,25,26,5,7,0,0,26,27,5,8,
0,0,27,5,1,0,0,0,28,29,5,4,0,0,29,30,5,7,0,0,30,31,5,9,0,0,31,7,1,0,0,0,
32,33,5,5,0,0,33,34,5,7,0,0,34,35,5,10,0,0,35,9,1,0,0,0,36,37,5,6,0,0,37,
38,5,7,0,0,38,39,5,10,0,0,39,11,1,0,0,0,0];


const atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

const decisionsToDFA = atn.decisionToState.map( (ds, index) => new antlr4.dfa.DFA(ds, index) );

const sharedContextCache = new antlr4.atn.PredictionContextCache();

export default class HotelSysParser extends antlr4.Parser {

    static grammarFileName = "HotelSys.g4";
    static literalNames = [ null, "'RESERVA'", "'CLIENTE'", "'HABITACION'", 
                            "'FECHA'", "'NOCHES'", "'PERSONAS'", "'='" ];
    static symbolicNames = [ null, "RESERVA", "CLIENTE", "HABITACION", "FECHA", 
                             "NOCHES", "PERSONAS", "EQ", "ROOM_ID", "DATE", 
                             "INT", "IDENT", "WS" ];
    static ruleNames = [ "reserva", "campoCliente", "campoHabitacion", "campoFecha", 
                         "campoNoches", "campoPersonas" ];

    constructor(input) {
        super(input);
        this._interp = new antlr4.atn.ParserATNSimulator(this, atn, decisionsToDFA, sharedContextCache);
        this.ruleNames = HotelSysParser.ruleNames;
        this.literalNames = HotelSysParser.literalNames;
        this.symbolicNames = HotelSysParser.symbolicNames;
    }



	reserva() {
	    let localctx = new ReservaContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 0, HotelSysParser.RULE_reserva);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 12;
	        this.match(HotelSysParser.RESERVA);
	        this.state = 13;
	        this.campoCliente();
	        this.state = 14;
	        this.campoHabitacion();
	        this.state = 15;
	        this.campoFecha();
	        this.state = 16;
	        this.campoNoches();
	        this.state = 17;
	        this.campoPersonas();
	        this.state = 18;
	        this.match(HotelSysParser.EOF);
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	campoCliente() {
	    let localctx = new CampoClienteContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 2, HotelSysParser.RULE_campoCliente);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 20;
	        this.match(HotelSysParser.CLIENTE);
	        this.state = 21;
	        this.match(HotelSysParser.EQ);
	        this.state = 22;
	        this.match(HotelSysParser.IDENT);
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	campoHabitacion() {
	    let localctx = new CampoHabitacionContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 4, HotelSysParser.RULE_campoHabitacion);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 24;
	        this.match(HotelSysParser.HABITACION);
	        this.state = 25;
	        this.match(HotelSysParser.EQ);
	        this.state = 26;
	        this.match(HotelSysParser.ROOM_ID);
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	campoFecha() {
	    let localctx = new CampoFechaContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 6, HotelSysParser.RULE_campoFecha);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 28;
	        this.match(HotelSysParser.FECHA);
	        this.state = 29;
	        this.match(HotelSysParser.EQ);
	        this.state = 30;
	        this.match(HotelSysParser.DATE);
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	campoNoches() {
	    let localctx = new CampoNochesContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 8, HotelSysParser.RULE_campoNoches);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 32;
	        this.match(HotelSysParser.NOCHES);
	        this.state = 33;
	        this.match(HotelSysParser.EQ);
	        this.state = 34;
	        this.match(HotelSysParser.INT);
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	campoPersonas() {
	    let localctx = new CampoPersonasContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 10, HotelSysParser.RULE_campoPersonas);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 36;
	        this.match(HotelSysParser.PERSONAS);
	        this.state = 37;
	        this.match(HotelSysParser.EQ);
	        this.state = 38;
	        this.match(HotelSysParser.INT);
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}


}

HotelSysParser.EOF = antlr4.Token.EOF;
HotelSysParser.RESERVA = 1;
HotelSysParser.CLIENTE = 2;
HotelSysParser.HABITACION = 3;
HotelSysParser.FECHA = 4;
HotelSysParser.NOCHES = 5;
HotelSysParser.PERSONAS = 6;
HotelSysParser.EQ = 7;
HotelSysParser.ROOM_ID = 8;
HotelSysParser.DATE = 9;
HotelSysParser.INT = 10;
HotelSysParser.IDENT = 11;
HotelSysParser.WS = 12;

HotelSysParser.RULE_reserva = 0;
HotelSysParser.RULE_campoCliente = 1;
HotelSysParser.RULE_campoHabitacion = 2;
HotelSysParser.RULE_campoFecha = 3;
HotelSysParser.RULE_campoNoches = 4;
HotelSysParser.RULE_campoPersonas = 5;

class ReservaContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = HotelSysParser.RULE_reserva;
    }

	RESERVA() {
	    return this.getToken(HotelSysParser.RESERVA, 0);
	};

	campoCliente() {
	    return this.getTypedRuleContext(CampoClienteContext,0);
	};

	campoHabitacion() {
	    return this.getTypedRuleContext(CampoHabitacionContext,0);
	};

	campoFecha() {
	    return this.getTypedRuleContext(CampoFechaContext,0);
	};

	campoNoches() {
	    return this.getTypedRuleContext(CampoNochesContext,0);
	};

	campoPersonas() {
	    return this.getTypedRuleContext(CampoPersonasContext,0);
	};

	EOF() {
	    return this.getToken(HotelSysParser.EOF, 0);
	};

	enterRule(listener) {
	    if(listener instanceof HotelSysListener ) {
	        listener.enterReserva(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof HotelSysListener ) {
	        listener.exitReserva(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof HotelSysVisitor ) {
	        return visitor.visitReserva(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}



class CampoClienteContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = HotelSysParser.RULE_campoCliente;
    }

	CLIENTE() {
	    return this.getToken(HotelSysParser.CLIENTE, 0);
	};

	EQ() {
	    return this.getToken(HotelSysParser.EQ, 0);
	};

	IDENT() {
	    return this.getToken(HotelSysParser.IDENT, 0);
	};

	enterRule(listener) {
	    if(listener instanceof HotelSysListener ) {
	        listener.enterCampoCliente(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof HotelSysListener ) {
	        listener.exitCampoCliente(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof HotelSysVisitor ) {
	        return visitor.visitCampoCliente(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}



class CampoHabitacionContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = HotelSysParser.RULE_campoHabitacion;
    }

	HABITACION() {
	    return this.getToken(HotelSysParser.HABITACION, 0);
	};

	EQ() {
	    return this.getToken(HotelSysParser.EQ, 0);
	};

	ROOM_ID() {
	    return this.getToken(HotelSysParser.ROOM_ID, 0);
	};

	enterRule(listener) {
	    if(listener instanceof HotelSysListener ) {
	        listener.enterCampoHabitacion(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof HotelSysListener ) {
	        listener.exitCampoHabitacion(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof HotelSysVisitor ) {
	        return visitor.visitCampoHabitacion(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}



class CampoFechaContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = HotelSysParser.RULE_campoFecha;
    }

	FECHA() {
	    return this.getToken(HotelSysParser.FECHA, 0);
	};

	EQ() {
	    return this.getToken(HotelSysParser.EQ, 0);
	};

	DATE() {
	    return this.getToken(HotelSysParser.DATE, 0);
	};

	enterRule(listener) {
	    if(listener instanceof HotelSysListener ) {
	        listener.enterCampoFecha(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof HotelSysListener ) {
	        listener.exitCampoFecha(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof HotelSysVisitor ) {
	        return visitor.visitCampoFecha(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}



class CampoNochesContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = HotelSysParser.RULE_campoNoches;
    }

	NOCHES() {
	    return this.getToken(HotelSysParser.NOCHES, 0);
	};

	EQ() {
	    return this.getToken(HotelSysParser.EQ, 0);
	};

	INT() {
	    return this.getToken(HotelSysParser.INT, 0);
	};

	enterRule(listener) {
	    if(listener instanceof HotelSysListener ) {
	        listener.enterCampoNoches(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof HotelSysListener ) {
	        listener.exitCampoNoches(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof HotelSysVisitor ) {
	        return visitor.visitCampoNoches(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}



class CampoPersonasContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = HotelSysParser.RULE_campoPersonas;
    }

	PERSONAS() {
	    return this.getToken(HotelSysParser.PERSONAS, 0);
	};

	EQ() {
	    return this.getToken(HotelSysParser.EQ, 0);
	};

	INT() {
	    return this.getToken(HotelSysParser.INT, 0);
	};

	enterRule(listener) {
	    if(listener instanceof HotelSysListener ) {
	        listener.enterCampoPersonas(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof HotelSysListener ) {
	        listener.exitCampoPersonas(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof HotelSysVisitor ) {
	        return visitor.visitCampoPersonas(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}




HotelSysParser.ReservaContext = ReservaContext; 
HotelSysParser.CampoClienteContext = CampoClienteContext; 
HotelSysParser.CampoHabitacionContext = CampoHabitacionContext; 
HotelSysParser.CampoFechaContext = CampoFechaContext; 
HotelSysParser.CampoNochesContext = CampoNochesContext; 
HotelSysParser.CampoPersonasContext = CampoPersonasContext; 
