export const USER_ROLE = {
    contributor: "contributor",
    maintainer: "maintainer",
    
} as const

export type ROLES = 'contributor' | 'maintainer';


export interface Issue {
  id?: number;
  title: string;
  description: string;
  type: "bug" | "feature_request";
  status?: "open" | "in_progress" | "resolved";
  reporter_id: number;
  created_at?: string;
  updated_at?: string;
}


export type IssueQueryPayload = {
    sort?: "newest" | "oldest";
    type?: "bug" | "feature_request";
    status?: "open" | "in_progress" | "resolved";
}