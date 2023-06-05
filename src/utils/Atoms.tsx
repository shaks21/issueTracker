import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { IssueType } from '../types/Issue';
import  User  from '../types/user.model';

type SortOrder = "asc" | "desc";
type SortBy = keyof IssueType;

export const issuesAtom = atom<IssueType[]>([]);
export const usersAtom = atom<User[]>([]);
export const tableViewAtom = atom(false);
export const sortOrderAtom = atom<SortOrder>("asc");
// export const sortByAtom = atom<SortBy>("title");
export const sortByAtom = atom("title");


//export const FeedbackAtom = atomWithStorage("feedback", []);
// export const IssuesAtom = atom([]);

export const DetailAtom = atom(0);

export const PrevPageAtom = atom("https://yvnsfb.csb.app/");
