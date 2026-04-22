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
  display_name: string;
  bio: string;
  headline: string;
  location: string;
  avatar_url: string;
  company: string;
  website: string;
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
  years_of_experience: number;
  current_title: string;
  current_company: string;
  source_priority: string;
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
