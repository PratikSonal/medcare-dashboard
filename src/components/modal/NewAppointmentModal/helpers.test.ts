import type { Appointment } from "@/features/appointments/types";

import { getConflict,minToTime, t2m, toLeft, toWidth } from "./helpers";

const makeAppt = (time: string, duration: number): Appointment =>
  ({
    id: "A1",
    patientId: "P001",
    patientName: "Test",
    patientAvatar: "T",
    dob: "01 Jan 1990",
    phone: "+91 00000 00000",
    doctor: "Dr. Test",
    department: "General",
    clinicName: "Test Clinic",
    date: "2026-05-14",
    time,
    duration,
    status: "Confirmed",
    type: "Routine Check",
    intakeComplete: false,
    insuranceVerified: false,
    insuranceProvider: "Test Insurance",
  } as Appointment);

describe("t2m", () => {
  it("converts HH:MM to minutes since midnight", () => {
    expect(t2m("09:00")).toBe(540);
    expect(t2m("13:30")).toBe(810);
    expect(t2m("00:00")).toBe(0);
    expect(t2m("23:59")).toBe(1439);
  });
});

describe("minToTime", () => {
  it("converts minutes to HH:MM string", () => {
    expect(minToTime(540)).toBe("09:00");
    expect(minToTime(810)).toBe("13:30");
    expect(minToTime(0)).toBe("00:00");
    expect(minToTime(65)).toBe("01:05");
  });

  it("t2m and minToTime are inverse operations", () => {
    const times = ["09:00", "10:30", "14:15", "17:45"];
    times.forEach(time => {
      expect(minToTime(t2m(time))).toBe(time);
    });
  });
});

describe("toLeft / toWidth", () => {
  it("produces a percentage string", () => {
    expect(toLeft(9 * 60)).toBe("0.00%");
    expect(toWidth(0)).toBe("0.00%");
  });
});

describe("getConflict", () => {
  const busy = [makeAppt("10:00", 60)];

  it("returns no conflict when slot is before busy block", () => {
    const result = getConflict("09:00", 30, busy, []);
    expect(result.doctor).toBeUndefined();
    expect(result.patient).toBeUndefined();
  });

  it("returns no conflict when slot is after busy block", () => {
    const result = getConflict("11:00", 30, busy, []);
    expect(result.doctor).toBeUndefined();
  });

  it("returns no conflict when slot abuts busy block exactly", () => {
    // busy ends at 11:00 (10:00 + 60 min), slot starts at 11:00
    const result = getConflict("11:00", 30, busy, []);
    expect(result.doctor).toBeUndefined();
  });

  it("detects overlap when new slot starts inside busy block", () => {
    // slot 10:30–11:00 overlaps busy 10:00–11:00
    const result = getConflict("10:30", 30, busy, []);
    expect(result.doctor).toBeDefined();
  });

  it("detects overlap when new slot fully contains busy block", () => {
    // slot 09:45–11:15 contains busy 10:00–11:00
    const result = getConflict("09:45", 90, busy, []);
    expect(result.doctor).toBeDefined();
  });

  it("detects overlap when new slot starts before and ends inside busy block", () => {
    // slot 09:30–10:30 overlaps start of busy 10:00–11:00
    const result = getConflict("09:30", 60, busy, []);
    expect(result.doctor).toBeDefined();
  });

  it("detects patient conflict independently", () => {
    const patBusy = [makeAppt("14:00", 45)];
    const result = getConflict("14:15", 30, [], patBusy);
    expect(result.doctor).toBeUndefined();
    expect(result.patient).toBeDefined();
  });

  it("detects both conflicts simultaneously", () => {
    const docBusy = [makeAppt("10:00", 60)];
    const patBusy = [makeAppt("10:00", 60)];
    const result = getConflict("10:30", 30, docBusy, patBusy);
    expect(result.doctor).toBeDefined();
    expect(result.patient).toBeDefined();
  });
});
