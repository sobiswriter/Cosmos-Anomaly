
# 🌌 Chronos Anomaly: Echoes of Choice

<p align="center">
  <em>The timelines are fractured. History is not a line, but a loom. And you hold the shuttle.</em>
</p>

---

Welcome to the Observatory, a place outside of time where history's greatest turning points are laid bare. **Chronos Anomaly** is not just a game; it's a cinematic, AI-driven narrative experience where you become the director of history itself. Alter a single event and watch as the Consequence Engine weaves a new reality, complete with unforeseen outcomes, dynamic visuals, and the ever-present, sarcastic commentary of The Watcher.

## ✨ Core Features

-   **The Consequence Engine**: At the heart of the anomaly lies a powerful narrative AI that generates a branching, cohesive story based on your choices. No two timelines are the same.
-   **The Artisan**: Key moments in your altered history are brought to life with dynamically generated multimedia assets, creating a unique visual representation of your new reality.
-   **The Watcher**: A jaded, omniscient AI provides real-time, voice-acted commentary on your temporal meddling. It's seen a billion timelines, and it's perpetually unimpressed with yours.
-   **Interactive Timeline**: Visually track your journey through altered history. Review your choices, the consequences, and the sarcastic remarks you've earned along the way.
-   **Forge Your Own Path**: Don't like the pre-defined scenarios? Describe your own historical divergence point and let the AI build a new world from your imagination.

## 🚀 The Tech Stack

This project is built on a modern, robust, and AI-centric foundation, designed for rapid development and a seamless user experience.

-   **Framework**: [Next.js](https://nextjs.org/) (with App Router)
-   **UI/UX**: [React](https://react.dev/), [ShadCN UI](https://ui.shadcn.com/), [Tailwind CSS](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/)
-   **Generative AI**: [Google Gemini](https://gemini.google.com/)
-   **AI Orchestration**: [Genkit](https://firebase.google.com/docs/genkit) (for defining AI flows, tools, and prompts)
-   **Development Environment**: [Firebase Studio](https://firebase.google.com/docs/studio)

## 🔧 Running Locally

Ready to bend time yourself? Here’s how to get the project running on your local machine.

### Prerequisites

-   Node.js (v20 or higher recommended)
-   An API key for Google's Generative AI. You can get one from the [Google AI Studio](https://aistudio.google.com/app/apikey).

### Setup

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/your-repo/chronos-anomaly.git
    cd chronos-anomaly
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Set Up Environment Variables**:
    Create a file named `.env` in the root of the project and add your Google AI API key:
    ```
    GOOGLE_API_KEY=your_google_api_key_here
    ```

4.  **Run the Development Servers**:
    This project requires two separate processes to run concurrently: the Next.js frontend and the Genkit AI backend.

    -   **In your first terminal**, start the Next.js development server:
        ```bash
        npm run dev
        ```
        This will typically run the frontend on `http://localhost:9002`.

    -   **In your second terminal**, start the Genkit development server:
        ```bash
        npm run genkit:watch
        ```
        This will start the Genkit AI flows and provide a local UI for inspecting them, usually on `http://localhost:4000`.

5.  **Open the App**:
    Navigate to `http://localhost:9002` in your browser. Choose a divergence point and start creating your own timeline!

---

<p align="center">
  Your choices are your own. The consequences are for all time.
</p>
