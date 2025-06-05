import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom"; // useParams gets URL params
import axios from "axios";
import "./UserProfile.css";

// Define TypeScript types for GitHub API responses
interface UserProfile {
  id: number;
  login: string;
  name: string;
  avatar_url: string;
  bio: string;
  location: string;
  followers: number;
  following: number;
  public_repos: number;
  html_url: string;
}

interface Repo {
  id: number;
  name: string;
  html_url: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
}

export default function UserProfile() {
  // Get the username from the URL (e.g., /user/octocat → username = "octocat")
  const { username } = useParams<{ username: string }>();

  // State for storing user data, repos, loading, and errors
  const [user, setUser] = useState<UserProfile | null>(null);
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user data when the component mounts or username changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch user info and repos at the same time using Promise.all
        const [userResponse, reposResponse] = await Promise.all([
          axios.get(`https://api.github.com/users/${username}`),
          axios.get(
            `https://api.github.com/users/${username}/repos?sort=updated&per_page=5`
          ),
        ]);

        setUser(userResponse.data);
        setRepos(reposResponse.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch user data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [username]); // Re-run effect if username changes

  // Show loading state
  if (loading) return <div className="loading">Loading...</div>;

  // Show error if API request fails
  if (error) return <div className="error">{error}</div>;

  // Show "Not Found" if no user data exists
  if (!user) return <div className="not-found">User not found</div>;

  return (
    <div className="profile-container">
      {/* Back button to return to search */}
      <Link to="/" className="back-button">
        ← Back to Search
      </Link>

      {/* User profile header (avatar, name, bio) */}
      <div className="profile-header">
        <img
          src={user.avatar_url}
          alt={user.login}
          className="profile-avatar"
        />
        <h1>{user.name || user.login}</h1>
        {user.bio && <p className="bio">{user.bio}</p>}
        {user.location && <p className="location">📍 {user.location}</p>}
        <a
          href={user.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="github-link"
        >
          View on GitHub
        </a>
      </div>

      {/* Stats (followers, following, repos) */}
      <div className="profile-stats">
        <div className="stat">
          <span className="stat-number">{user.followers}</span>
          <span className="stat-label">Followers</span>
        </div>
        <div className="stat">
          <span className="stat-number">{user.following}</span>
          <span className="stat-label">Following</span>
        </div>
        <div className="stat">
          <span className="stat-number">{user.public_repos}</span>
          <span className="stat-label">Public Repos</span>
        </div>
      </div>

      {/* Recent repositories list */}
      {repos.length > 0 && (
        <div className="repos-section">
          <h2>Recent Repositories</h2>
          <ul className="repo-list">
            {repos.map((repo) => (
              <li key={repo.id} className="repo-item">
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="repo-link"
                >
                  {repo.name}
                </a>
                {repo.description && (
                  <p className="repo-description">{repo.description}</p>
                )}
                <div className="repo-stats">
                  <span>⭐ {repo.stargazers_count}</span>
                  <span>⑂ {repo.forks_count}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
