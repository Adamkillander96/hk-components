/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { StyckDetaljTitle } from "./index";
export { StyckDetaljTitle } from "./index";
export namespace Components {
    interface HkStyckdetalj {
        /**
          * Set the language. Swedish (sv) or English (en).
         */
        "language": 'sv' | 'en';
        /**
          * Set a max-width if the component is not inside a max-width container. Any valid CSS string value is accepted.
         */
        "maxWidth": string;
        /**
          * Set a preselected detail.
         */
        "selected"?: StyckDetaljTitle;
    }
}
declare global {
    interface HTMLHkStyckdetaljElement extends Components.HkStyckdetalj, HTMLStencilElement {
    }
    var HTMLHkStyckdetaljElement: {
        prototype: HTMLHkStyckdetaljElement;
        new (): HTMLHkStyckdetaljElement;
    };
    interface HTMLElementTagNameMap {
        "hk-styckdetalj": HTMLHkStyckdetaljElement;
    }
}
declare namespace LocalJSX {
    interface HkStyckdetalj {
        /**
          * Set the language. Swedish (sv) or English (en).
         */
        "language"?: 'sv' | 'en';
        /**
          * Set a max-width if the component is not inside a max-width container. Any valid CSS string value is accepted.
         */
        "maxWidth"?: string;
        /**
          * Set a preselected detail.
         */
        "selected"?: StyckDetaljTitle;
    }
    interface IntrinsicElements {
        "hk-styckdetalj": HkStyckdetalj;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "hk-styckdetalj": LocalJSX.HkStyckdetalj & JSXBase.HTMLAttributes<HTMLHkStyckdetaljElement>;
        }
    }
}
