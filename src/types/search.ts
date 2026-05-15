export interface SearchFilters {
  languages?: string[];
  skills?: string[];
  min_stars?: number;
  min_experience_years?: number;
  location?: string;
  company?: string;
  topics?: string[];
  min_contributions?: number;
  min_followers?: number;
}

export interface SearchRequest {
  query: string;
  limit?: number;
  min_score?: number;
  rerank?: boolean;
  filters?: SearchFilters;
}

export interface DeveloperProfile {
  id: string;
  developer_profile_id: string;
  display_name: string | null;
  bio: string | null;
  headline: string | null;
  location: string | null;
  avatar_url: string | null;
  company: string | null;
  website: string | null;
  total_repos: number;
  total_stars: number;
  total_contributions: number;
  total_followers: number;
  total_hf_models: number;
  total_hf_datasets: number;
  total_hf_spaces: number;
  total_hf_downloads: number;
  total_hf_papers: number;
  languages: string[];
  skills: string[];
  topics: string[];
  years_of_experience: number | null;
  current_title: string | null;
  current_company: string | null;
  source_priority: string | Record<string, string>;
  merged_at: string;
}

export interface ProfileRanking {
  github_activity_score: number;
  technical_influence_score: number;
  hiring_fit_score: number;
  experience_score: number;
  skills_breadth_score: number;
  recency_score: number;
  oss_contribution_score: number;
  hf_impact_score: number;
  composite_score: number;
}

export interface SearchResult {
  profile: DeveloperProfile;
  score: number;
  ranking: ProfileRanking | null;
}
