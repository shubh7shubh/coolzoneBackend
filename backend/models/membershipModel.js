const mongoose = require("mongoose");

const membershipSchema = mongoose.Schema({
  memb_name: {
    type: String,
    // required: [true, "Please Enter Product Item"],
  },
  items: {
    type: String,
    // required: [true, "Please Enter Product Item"],
  },
  description: {
    type: String,
    // required: [true, "Please Enter discription of plan "],
    // trim: true,
  },
  price: {
    type: String,
    // required: [true, "Please Enter Price"],
  },

// Cutomer details 
  customerName:{
    type: String,
  },
  customerEmail:{
    type: String,
  },
  customerPhone:{
    type: String,
  },
  customerAddress:{
    type: String,
  },
  Landmark:{
    type: String,
  },
  State:{
    type: String,
  },
  country:{
    type: String,
  },
  AddAddress:{
    type: Boolean,
    default:false
  },
  BillingAddressSACA:{
    type: Boolean,
    default:false
  },
  LEDTV_SKU_ID:{
    type: String,
  },

  TopFreezer_SKU_ID:{
    type: String,
  },

  Microwave_SKU_ID:{
    type: String,
  },

  TopLoadAgitor_SKU_ID:{
    type: String,
  },




  // product membership section 

  BronzeMembership: {

    television: {
      LCD: {
        type: Boolean,
        default: false
      },
      LED: {
        type: Boolean,
        default: false

      },
      Plasma: {
        type: Boolean,
        default: false

      },
      SmartTV: {
        type: Boolean,
        default: false
      }
    },
    Fridge: {
      Household: {

        classicSingleDoorFridge: {
          type: Boolean,
          default: false
        },
        TopFreezer: {
          type: Boolean,
          default: false
        },
        BottomFreezer: {
          type: Boolean,
          default: false
        },
        SideBySide: {
          type: Boolean,
          default: false
        },
        FrenchDoor: {
          type: Boolean,
          default: false
        }

      },

      Commercial: {
        VisiCooler: {
          type: Boolean,
          default: false
        },
        DeepFreezer: {
          type: Boolean,
          default: false
        },
        ConfectionaryShowcase: {
          type: Boolean,
          default: false
        },
        UnderCounterChiller: {
          type: Boolean,
          default: false
        },
      }

    },

    washingMachine: {
      TopLoadAgitor: {
        type: Boolean,
        default: false
      },
      TopLoadImpeller: {
        type: Boolean,
        default: false
      },
      FrontLoad: {
        type: Boolean,
        default: false
      },
      FullyAutomaticFrontLoad: {
        type: Boolean,
        default: false
      },
    },

    AirConditioner: {

      WindowAC: {
        type: Boolean,
        default: false
      },
      SpilitAC: {
        type: Boolean,
        default: false
      },
      InverterSplitAc: {
        type: Boolean,
        default: false
      },
      CoolingCasette: {
        type: Boolean,
        default: false
      },
      ColumnAc: {
        type: Boolean,
        default: false
      },
    },

    Microwave: {
      Household: {

        Microwave: {
          type: Boolean,
          default: false
        },
        OTG: {
          type: Boolean,
          default: false
        },
        ConvectionOven: {
          type: Boolean,
          default: false
        }

      },

      Commercial: {
        StadaedOven: {
          type: Boolean,
          default: false
        },
        PizzaOven: {
          type: Boolean,
          default: false
        },
        ConveyerOven: {
          type: Boolean,
          default: false
        },
        RotisserieOven: {
          type: Boolean,
          default: false
        },
      }

    },
    Juicer: {
      type: Boolean,
      default: false
    },
    MixerGrinder: {
      type: Boolean,
      default: false
    },
    WaterPurifier: {
      type: Boolean,
      default: false
    },
  },

  SilverMembership: {
    television: {
      LCD: {
        type: Boolean,
        default: false
      },
      LED: {
        type: Boolean,
        default: false

      },
      Plasma: {
        type: Boolean,
        default: false

      },
      SmartTV: {
        type: Boolean,
        default: false
      }
    },
    Fridge: {
      Household: {

        classicSingleDoorFridge: {
          type: Boolean,
          default: false
        },
        TopFreezer: {
          type: Boolean,
          default: false
        },
        BottomFreezer: {
          type: Boolean,
          default: false
        },
        SideBySide: {
          type: Boolean,
          default: false
        },
        FrenchDoor: {
          type: Boolean,
          default: false
        }

      },

      Commercial: {
        VisiCooler: {
          type: Boolean,
          default: false
        },
        DeepFreezer: {
          type: Boolean,
          default: false
        },
        ConfectionaryShowcase: {
          type: Boolean,
          default: false
        },
        UnderCounterChiller: {
          type: Boolean,
          default: false
        },
      }

    },

    washingMachine: {
      TopLoadAgitor: {
        type: Boolean,
        default: false
      },
      TopLoadImpeller: {
        type: Boolean,
        default: false
      },
      FrontLoad: {
        type: Boolean,
        default: false
      },
      FullyAutomaticFrontLoad: {
        type: Boolean,
        default: false
      },
    },

    AirConditioner: {

      WindowAC: {
        type: Boolean,
        default: false
      },
      SpilitAC: {
        type: Boolean,
        default: false
      },
      InverterSplitAc: {
        type: Boolean,
        default: false
      },
      CoolingCasette: {
        type: Boolean,
        default: false
      },
      ColumnAc: {
        type: Boolean,
        default: false
      },
    },

    Microwave: {
      Household: {

        Microwave: {
          type: Boolean,
          default: false
        },
        OTG: {
          type: Boolean,
          default: false
        },
        ConvectionOven: {
          type: Boolean,
          default: false
        }

      },

      Commercial: {
        StadaedOven: {
          type: Boolean,
          default: false
        },
        PizzaOven: {
          type: Boolean,
          default: false
        },
        ConveyerOven: {
          type: Boolean,
          default: false
        },
        RotisserieOven: {
          type: Boolean,
          default: false
        },
      }

    },
    Juicer: {
      type: Boolean,
      default: false
    },
    MixerGrinder: {
      type: Boolean,
      default: false
    },
    WaterPurifier: {
      type: Boolean,
      default: false
    },
  },

  GoldenMembership: {
    television: {
      LCD: {
        type: Boolean,
        default: false
      },
      LED: {
        type: Boolean,
        default: false

      },
      Plasma: {
        type: Boolean,
        default: false

      },
      SmartTV: {
        type: Boolean,
        default: false
      }
    },
    Fridge: {
      Household: {

        classicSingleDoorFridge: {
          type: Boolean,
          default: false
        },
        TopFreezer: {
          type: Boolean,
          default: false
        },
        BottomFreezer: {
          type: Boolean,
          default: false
        },
        SideBySide: {
          type: Boolean,
          default: false
        },
        FrenchDoor: {
          type: Boolean,
          default: false
        }

      },

      Commercial: {
        VisiCooler: {
          type: Boolean,
          default: false
        },
        DeepFreezer: {
          type: Boolean,
          default: false
        },
        ConfectionaryShowcase: {
          type: Boolean,
          default: false
        },
        UnderCounterChiller: {
          type: Boolean,
          default: false
        },
      }

    },

    washingMachine: {
      TopLoadAgitor: {
        type: Boolean,
        default: false
      },
      TopLoadImpeller: {
        type: Boolean,
        default: false
      },
      FrontLoad: {
        type: Boolean,
        default: false
      },
      FullyAutomaticFrontLoad: {
        type: Boolean,
        default: false
      },
    },

    AirConditioner: {

      WindowAC: {
        type: Boolean,
        default: false
      },
      SpilitAC: {
        type: Boolean,
        default: false
      },
      InverterSplitAc: {
        type: Boolean,
        default: false
      },
      CoolingCasette: {
        type: Boolean,
        default: false
      },
      ColumnAc: {
        type: Boolean,
        default: false
      },
    },

    Microwave: {
      Household: {

        Microwave: {
          type: Boolean,
          default: false
        },
        OTG: {
          type: Boolean,
          default: false
        },
        ConvectionOven: {
          type: Boolean,
          default: false
        }

      },

      Commercial: {
        StadaedOven: {
          type: Boolean,
          default: false
        },
        PizzaOven: {
          type: Boolean,
          default: false
        },
        ConveyerOven: {
          type: Boolean,
          default: false
        },
        RotisserieOven: {
          type: Boolean,
          default: false
        },
      }

    },
    Juicer: {
      type: Boolean,
      default: false
    },
    MixerGrinder: {
      type: Boolean,
      default: false
    },
    WaterPurifier: {
      type: Boolean,
      default: false
    },
  },



  //   images: [
  //     {
  //       public_id: {
  //         type: String,
  //         required: true,
  //       },
  //       url: {
  //         type: String,
  //         required: true,
  //       },
  //     },
  //   ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Membership", membershipSchema);
