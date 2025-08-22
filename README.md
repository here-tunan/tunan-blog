[中文说明](README.zh-CN.md)

# Tunan Blog

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

A full-stack blog application built with Go and Next.js, featuring a modern, feature-rich admin panel and a clean, responsive public-facing interface.

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=here-tunan/tunan-blog&type=Date)](https://www.star-history.com/#here-tunan/tunan-blog&Date)

## Live Demo

[https://www.tunan.fun](https://www.tunan.fun)

## Features

### Public-Facing Site (`/ui`)

- **Blog & Articles**: Clean and readable interface for blog posts, with full Markdown rendering support.
- **Command Palette Search**: A fast, keyboard-driven search interface (like VS Code or GitHub) to quickly find articles and navigate the site.
- **Interactive Comment System**: Integrated with [Remark42](https://remark42.com/) for a privacy-focused, self-hosted commenting experience.
- **View Count Tracking**: Tracks and displays view counts for each article with real client IP detection.
- **RSS Feed Generation**: Automatically generates RSS feeds with article summaries (optimized for performance).
- **Social Integration**: Header icons for easy access to GitHub, Discord, Folo, and RSS feeds.
- **Folo Reader Integration**: Includes specific tracking points and direct links for the [Folo](https://folo.im/) RSS reader.
- **Book Recommendations**: A dedicated section to display a curated list of books.
- **Project Showcase**: Display personal or professional projects.
- **SEO Friendly**: Includes Google Search Console verification and RSS auto-discovery meta tags.
- **Responsive Design**: Fully responsive layout for an optimal experience on any device.
- **Dark/Light Theme**: A theme switcher for user preference.

### Admin Panel (`/ui-admin`)

- **Secure Authentication**: JWT-based login system to protect admin routes.
- **Analytics Dashboard**: View key metrics including page view leaderboard and traffic analytics.
- **RSS Management**: One-click RSS feed generation and management tools.
- **Full CRUD for Articles**: Create, Read, Update, and Delete articles with a rich text editor.
- **Full CRUD for Books**: Easily manage the book recommendation list.
- **Modern UI**: Built with Ant Design for a professional and intuitive user experience.
- **Themeable**: Supports both light and dark modes.

## Tech Stack

- **Backend**: Go (Golang) with the [Fiber](https://gofiber.io/) web framework.
- **Frontend (Public)**: [Next.js](https://nextjs.org/) (React), TypeScript, Tailwind CSS.
- **Frontend (Admin)**: [Next.js](https://nextjs.org/) (React), TypeScript, [Ant Design](https://ant.design/).
- **Database**: Designed to be compatible with MySQL and SQLite.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Go (version 1.18 or higher)
- Node.js (version 18 or higher)
- A running database instance: MySQL (v8.0+) or SQLite3
- npm or yarn

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/tunan-blog.git
    cd tunan-blog
    ```

2.  **Setup the Database:**
    - For MySQL, create a new database (e.g., `tunan`).
    - Import the table structure by executing the `schema.sql` file located in the root of the project.
      ```sh
      # Example for MySQL
      mysql -u your_user -p your_database < schema.sql
      ```

3.  **Configure and Run the Backend:**
    - Navigate to the project root.
    - Create and configure your environment file (e.g., `env/dev.yaml`) with your database credentials and other settings.
    - Run the backend server:
      ```sh
      go run cmd/tunan-blog/main.go
      ```
    - The backend will be available at `http://localhost:3002`.

4.  **Setup the Public Frontend:**
    - Navigate to the UI directory:
      ```sh
      cd ui
      ```
    - Install dependencies:
      ```sh
      npm install
      ```
    - Run the development server:
      ```sh
      npm run dev
      ```
    - The public site will be available at `http://localhost:3000`.

5.  **Setup the Admin Panel:**
    - Navigate to the admin UI directory:
      ```sh
      cd ui-admin
      ```
    - Install dependencies:
      ```sh
      npm install
      ```
    - Run the development server:
      ```sh
      npm run dev
      ```
    - The admin panel will be available at `http://localhost:3001`.

## Configuration

All backend configuration is managed via YAML files in the `/env` directory. The application loads `dev.yaml` by default, or `prod.yaml` if the `GO_TUNAN_BLOG_ENV` environment variable is set to `prod`.

### Admin Authentication

Admin login is handled by JWT. You need to configure the password and JWT secret in your `.yaml` file.

1.  **Set a temporary password**: In your `dev.yaml` or `prod.yaml`, set a plaintext password for `admin_password` and a random string for `jwt_secret`.
    ```yaml
    auth:
      admin_password: "your-temporary-strong-password"
      jwt_secret: "a-very-strong-and-secret-string-for-jwt"
    ```
2.  **Generate Password Hash**: Start the backend server (`go run cmd/tunan-blog/main.go`). The application will detect the plaintext password, automatically hash it using bcrypt, and print the hash in the console logs. The log message will look like this:
    ```
    IMPORTANT: Please update your dev.yaml with the new hashed password:
    auth:
      admin_password: "$2a$10$....(a long hash string)..."
    ```
3.  **Update Configuration**: Copy the entire hash string (`$2a$...`) from the log and replace your temporary password in the `.yaml` file. This is your permanent, secure password hash.
4.  **Restart**: Restart the backend server. Now you can log in with the password you set in step 1.

### Google Site Verification

To verify your ownership of the site with Google Search Console:

1.  **File Location**: The meta tag is located in `ui/app/layout.tsx`.
2.  **Find the line**:
    ```html
    <meta name="google-site-verification" content="xxxx"/>
    ```
3.  **Update the code**: Replace `xxxx` with your own verification code provided by Google.

### Folo Reader Integration

To configure the Folo RSS reader tracking, update the following fields in your `.yaml` configuration file under the `website` key:

```yaml
website:
  # ... other website settings
  follow_feed_id: "YOUR_FOLO_FEED_ID"
  follow_user_id: "YOUR_FOLO_USER_ID"
```

### RSS Feed Configuration

The RSS feed is automatically generated with optimized article summaries for better performance:

- **Location**: Generated at `/rss.xml` in the project root
- **Content**: Article summaries (approximately 200 characters) instead of full content
- **Auto-Discovery**: Meta tags are automatically included in the HTML head for RSS reader detection
- **Management**: Use the admin panel dashboard to generate/update the RSS feed with one click

### Social Links Configuration

Update the social media links in the navigation component (`ui/app/components/Navigation.tsx`):

- **GitHub**: Update the href in the GitHub icon link
- **Discord**: Update the Discord server invitation URL
- **Folo**: Update the Folo user profile URL

### IP Address Tracking

For accurate visitor IP tracking behind reverse proxies (nginx):

1. **Fiber Configuration**: The app is configured to trust proxy headers
2. **Nginx Setup**: Ensure your nginx configuration passes the real client IP:
   ```nginx
   location /api/ {
       proxy_pass http://localhost:3002;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $scheme;
       proxy_set_header Host $host;
   }
   ```

## Project Structure

A brief overview of the key directories in this project:

```
.
├── api/          # Go source code for the backend API
├── cmd/          # Main application entry point for the backend
├── internal/     # Backend business logic (services, repositories)
├── ui/           # Next.js source for the public-facing website
└── ui-admin/     # Next.js source for the admin panel
```

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

Distributed under the Apache 2.0 License. See `LICENSE` for more information.
