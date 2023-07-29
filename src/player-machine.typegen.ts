
  // This file was automatically generated. Edits will be overwritten

  export interface Typegen0 {
        '@@xstate/typegen': true;
        internalEvents: {
          "": { type: "" };
"xstate.init": { type: "xstate.init" };
        };
        invokeSrcNameMap: {
          
        };
        missingImplementations: {
          actions: never;
          delays: never;
          guards: never;
          services: never;
        };
        eventsCausingActions: {
          "notifyGame": "";
"takeDamage": "DAMAGE";
        };
        eventsCausingDelays: {
          
        };
        eventsCausingGuards: {
          "isDead": "";
        };
        eventsCausingServices: {
          
        };
        matchesStates: "Alive" | "Dead";
        tags: never;
      }
  