import { describe, expect, it } from "vitest";

import {
  formatHoursGroups,
  formatTime,
  getCafeStatus,
  isPlaceholderIntro,
} from "../cafe-content";

describe("formatTime", () => {
  it("converts morning times to 12-hour format", () => {
    expect(formatTime("09:00")).toBe("9:00 AM");
    expect(formatTime("00:15")).toBe("12:15 AM");
  });

  it("converts afternoon and evening times to 12-hour format", () => {
    expect(formatTime("15:30")).toBe("3:30 PM");
    expect(formatTime("22:00")).toBe("10:00 PM");
  });

  it("preserves minutes and returns undefined for missing time", () => {
    expect(formatTime("12:45")).toBe("12:45 PM");
    expect(formatTime(undefined)).toBeUndefined();
  });
});

describe("getCafeStatus", () => {
  const mondayHours = [{ day: "Monday", open: "15:00", close: "22:30" }];

  it("reports open during the cafe's operating hours in Manila", () => {
    const now = new Date("2026-10-26T16:00:00+08:00");

    expect(getCafeStatus(mondayHours, now)).toEqual({
      label: "Open now",
      state: "open",
    });
  });

  it("reports closed outside the cafe's operating hours", () => {
    const now = new Date("2026-10-26T23:00:00+08:00");

    expect(getCafeStatus(mondayHours, now)).toEqual({
      label: "Closed",
      detail: "3:00 PM",
      state: "closed",
    });
  });

  it("reports pending when no hours have been provided", () => {
    expect(getCafeStatus([], new Date("2026-10-26T16:00:00+08:00"))).toEqual({
      label: "Hours pending",
      state: "pending",
    });
  });
});

describe("formatHoursGroups", () => {
  it("groups days that share the same hours", () => {
    expect(formatHoursGroups([
      { day: "Monday", open: "15:00", close: "22:30" },
      { day: "Tuesday", open: "15:00", close: "22:30" },
    ])).toEqual([
      { days: "Mon & Tue", time: "3:00 PM – 10:30 PM" },
    ]);
  });

  it("keeps different schedules in separate groups", () => {
    expect(formatHoursGroups([
      { day: "Monday", open: "15:00", close: "22:30" },
      { day: "Wednesday", open: "10:00", close: "18:00" },
    ])).toEqual([
      { days: "Mon", time: "3:00 PM – 10:30 PM" },
      { days: "Wed", time: "10:00 AM – 6:00 PM" },
    ]);
  });

  it("lists closed days after open schedules", () => {
    expect(formatHoursGroups([
      { day: "Monday", closed: true },
      { day: "Tuesday", open: "15:00", close: "22:30" },
    ])).toEqual([
      { days: "Tue", time: "3:00 PM – 10:30 PM" },
      { days: "Mon", time: "Closed" },
    ]);
  });
});

describe("isPlaceholderIntro", () => {
  it("recognizes known placeholder copy regardless of capitalization", () => {
    expect(isPlaceholderIntro("Coming soon")).toBe(true);
    expect(isPlaceholderIntro("Menu details to be confirmed")).toBe(true);
    expect(isPlaceholderIntro("Lorem ipsum dolor sit amet")).toBe(true);
  });

  it("recognizes empty or whitespace-only copy as a placeholder", () => {
    expect(isPlaceholderIntro(undefined)).toBe(true);
    expect(isPlaceholderIntro("   ")).toBe(true);
  });

  it("keeps real introduction copy", () => {
    expect(isPlaceholderIntro("Espresso, signatures, and pastries in Yati, Liloan.")).toBe(false);
  });
});