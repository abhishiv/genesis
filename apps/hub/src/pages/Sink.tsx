/** @jsx h **/

import { component, h, render } from "rocky7";

export const Sink = component("Sink", (props, { signal, wire }) => {
  const count = signal("count", 0);
  return (
    <div id="home">
      <p>Hey</p>
      <button
        onClick={() => {
          count(count() + 1);
        }}
      >
        Increment to {wire(count)}
      </button>
    </div>
  );
});
