import patientsReducer, {
  setSearchQuery,
  setFilterStatus,
  setFilterDepartment,
  clearFilters,
} from "./patientsSlice";

const initialState = patientsReducer(undefined, { type: "@@INIT" });

describe("patientsSlice applyFilters", () => {
  it("starts with all patients in filteredPatients", () => {
    expect(initialState.filteredPatients).toHaveLength(initialState.patients.length);
  });

  it("filters by name search query (case-insensitive)", () => {
    const state = patientsReducer(initialState, setSearchQuery("aarav"));
    expect(state.filteredPatients.every(p => p.name.toLowerCase().includes("aarav"))).toBe(true);
  });

  it("filters by diagnosis search query", () => {
    const state = patientsReducer(initialState, setSearchQuery("diabetes"));
    expect(state.filteredPatients.every(p => p.diagnosis.toLowerCase().includes("diabetes"))).toBe(true);
  });

  it("returns empty array when no patients match the query", () => {
    const state = patientsReducer(initialState, setSearchQuery("zzznomatch"));
    expect(state.filteredPatients).toHaveLength(0);
  });

  it("filters by status", () => {
    const state = patientsReducer(initialState, setFilterStatus("Critical"));
    expect(state.filteredPatients.every(p => p.status === "Critical")).toBe(true);
    expect(state.filteredPatients.length).toBeGreaterThan(0);
  });

  it("filters by department", () => {
    const state = patientsReducer(initialState, setFilterDepartment("Cardiology"));
    expect(state.filteredPatients.every(p => p.department === "Cardiology")).toBe(true);
    expect(state.filteredPatients.length).toBeGreaterThan(0);
  });

  it("combines status and department filters (AND logic)", () => {
    let state = patientsReducer(initialState, setFilterStatus("Active"));
    state = patientsReducer(state, setFilterDepartment("Cardiology"));
    expect(
      state.filteredPatients.every(p => p.status === "Active" && p.department === "Cardiology"),
    ).toBe(true);
  });

  it("clearFilters restores all patients", () => {
    let state = patientsReducer(initialState, setSearchQuery("aarav"));
    state = patientsReducer(state, setFilterStatus("Critical"));
    state = patientsReducer(state, clearFilters());
    expect(state.filteredPatients).toHaveLength(state.patients.length);
    expect(state.searchQuery).toBe("");
    expect(state.filterStatus).toBe("All");
    expect(state.filterDepartment).toBe("All");
  });

  it("search query filters across patient id", () => {
    const state = patientsReducer(initialState, setSearchQuery("P003"));
    expect(state.filteredPatients.some(p => p.id === "P003")).toBe(true);
    expect(state.filteredPatients.every(p => p.id.toLowerCase().includes("p003"))).toBe(true);
  });
});
