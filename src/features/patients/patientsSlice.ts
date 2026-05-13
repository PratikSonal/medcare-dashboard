import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Patient } from "./types";
import type { ViewMode } from "@/features/ui/types";
import { mockPatients } from "@/lib/mockData";

interface PatientsState {
  patients: Patient[];
  filteredPatients: Patient[];
  selectedPatient: Patient | null;
  viewMode: ViewMode;
  searchQuery: string;
  filterStatus: string;
  filterDepartment: string;
  isLoading: boolean;
}

const initialState: PatientsState = {
  patients: mockPatients,
  filteredPatients: mockPatients,
  selectedPatient: null,
  viewMode: "grid",
  searchQuery: "",
  filterStatus: "All",
  filterDepartment: "All",
  isLoading: false,
};

const applyFilters = (state: PatientsState) => {
  let result = [...state.patients];
  if (state.searchQuery) {
    const q = state.searchQuery.toLowerCase();
    result = result.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.diagnosis.toLowerCase().includes(q) ||
        p.doctor.toLowerCase().includes(q) ||
        p.department.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q),
    );
  }
  if (state.filterStatus !== "All") result = result.filter(p => p.status === state.filterStatus);
  if (state.filterDepartment !== "All")
    result = result.filter(p => p.department === state.filterDepartment);
  state.filteredPatients = result;
}

const patientsSlice = createSlice({
  name: "patients",
  initialState,
  reducers: {
    setViewMode(state, action: PayloadAction<ViewMode>) {
      state.viewMode = action.payload;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
      applyFilters(state);
    },
    setFilterStatus(state, action: PayloadAction<string>) {
      state.filterStatus = action.payload;
      applyFilters(state);
    },
    setFilterDepartment(state, action: PayloadAction<string>) {
      state.filterDepartment = action.payload;
      applyFilters(state);
    },
    addPatient(state, action: PayloadAction<Patient>) {
      state.patients.push(action.payload);
      applyFilters(state);
    },
    setSelectedPatient(state, action: PayloadAction<Patient | null>) {
      state.selectedPatient = action.payload;
    },
    clearFilters(state) {
      state.searchQuery = "";
      state.filterStatus = "All";
      state.filterDepartment = "All";
      state.filteredPatients = state.patients;
    },
  },
});

export const {
  setViewMode,
  setSearchQuery,
  setFilterStatus,
  setFilterDepartment,
  addPatient,
  setSelectedPatient,
  clearFilters,
} = patientsSlice.actions;
export default patientsSlice.reducer;
