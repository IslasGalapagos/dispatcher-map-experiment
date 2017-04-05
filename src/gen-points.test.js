import { bounds, generatePoints } from "./gen-points";

it("should generate random points", () => {
  const points = generatePoints();

  for (let i = 0; i < 5; i++) {
    let point = points[i];
    expect(point.lat).toBeGreaterThanOrEqual(bounds[1][0]);
    expect(point.lat).toBeLessThanOrEqual(bounds[0][0]);

    expect(point.lng).toBeGreaterThanOrEqual(bounds[1][1]);
    expect(point.lng).toBeLessThanOrEqual(bounds[0][1]);
  }
});
