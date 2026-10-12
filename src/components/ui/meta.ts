import type { Meta } from "@/content/types";

/**
 * Serialises inspectable metadata onto a canvas node as data-* attributes.
 * The canvas engine and guide read them back from the DOM on selection, so the
 * content never has to be shipped to the client twice.
 */
export function metaAttrs(m: Meta) {
  return {
    "data-title": m.title,
    "data-kind": m.kind,
    "data-client": m.client,
    "data-year": m.year,
    "data-role": m.role,
    "data-tools": m.tools,
    "data-status": m.status,
    "data-brief": m.brief,
    "data-outcome": m.outcome,
  };
}
