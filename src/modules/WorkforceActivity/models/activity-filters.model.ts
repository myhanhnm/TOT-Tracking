export type ActivityFilters = {
  date: string | null;
  associateName: string;
  loginId: string;
  function: string;
  process: string;
  unitClass: string;
  search: string;
};

export type ActivityFilterOptions = {
  dates: string[];
  associateNames: string[];
  loginIds: string[];
  functions: string[];
  processes: string[];
  unitClasses: string[];
};
