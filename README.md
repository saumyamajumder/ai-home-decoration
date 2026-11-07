🏡 AI Home Decoration – Transform Your Space with AI

An AI-powered interior design web application that helps users transform their existing rooms into beautiful, modern and personalized spaces.

Upload a photograph of your kitchen, bedroom, living room or any other space, describe the changes you want, select your preferred design style, and visualize your dream interior with AI.

✨ Project Overview

AI Home Decoration is designed to make interior design easier and more accessible.

Instead of hiring a designer or manually imagining how furniture and decorations will look, users can upload their existing room photographs and explore new design possibilities using AI.

The application combines AI-powered image understanding, image editing and modern web technologies to provide an interactive interior design experience.

🚀 Key Features
1. Image Upload
Upload room photographs from your device.
Drag-and-drop image upload.
Support JPG, JPEG, PNG and WebP.
Preview uploaded photographs.
Replace or remove uploaded images.
Store original images securely.
2. AI Room Analysis

Use Google Gemini to understand uploaded room photographs.

AI can identify:

Room categories.
Existing furniture.
Kitchen cabinets.
Sink and countertop.
Oven and refrigerator.
Doors and windows.
Existing room arrangements.
3. AI Decoration Instructions

Users can describe their desired modifications using natural language.

Example:

"Add a modern built-in oven below the kitchen countertop, place a dustbin underneath the sink, change the cabinets to white and maintain the existing kitchen layout."

Additional features:

Ready-made prompt suggestions.
Custom decoration instructions.
Prompt history.
Multiple combined instructions.
Design preferences.
4. Interior Design Styles

Explore different interior design styles:

Modern
Minimalist
Luxury
Scandinavian
Contemporary
Traditional
Industrial
Rustic
5. AI Image Modification

The application is designed to use an independent image-generation engine to modify uploaded photographs.

Planned capabilities:

Add furniture and appliances.
Change cabinet colours.
Modify countertops.
Replace decorations.
Update wall designs.
Modify selected image areas.
Generate multiple design variations.
6. Before and After Comparison

Compare the original room photograph with the redesigned version.

Side-by-side comparison.
Interactive comparison slider.
Image preview.
Download modified images.
Save design variations.
7. Project Management
Save interior design projects.
View previously uploaded photographs.
Store generated designs.
Maintain prompt history.
Reopen previous projects.
Manage design variations.
8. Responsive Dashboard
Modern dashboard interface.
Collapsible sidebar.
Expand and collapse navigation.
Responsive mobile layout.
Project overview.
Recent designs.
🛠️ Technology Stack
Frontend
Next.js
React
TypeScript
Tailwind CSS
Shadcn UI
Lucide React
Fabric.js
Backend
Next.js App Router
Node.js
TypeScript
REST API architecture
Artificial Intelligence
Google Gemini API – Room understanding and image analysis.
ComfyUI – Planned local image-generation integration.
SDXL Inpainting – Planned open-source image-editing model.
Database and Storage
Supabase
PostgreSQL
Supabase Storage
Deployment
Vercel
Local or hosted AI image-generation service.
📂 Project Structure
text
ai-home-decoration/
│
├── app/
│   ├── dashboard/
│   ├── editor/
│   ├── projects/
│   ├── gallery/
│   ├── settings/
│   │
│   └── api/
│       ├── upload-image/
│       ├── analyze-image/
│       ├── generate-design/
│       ├── generate-status/
│       └── projects/
│
├── components/
│   ├── dashboard/
│   ├── editor/
│   ├── upload/
│   ├── gallery/
│   └── ui/
│
├── lib/
│   ├── ai/
│   ├── database/
│   ├── image/
│   └── utils/
│
├── hooks/
│
├── types/
│
├── public/
│
├── .env.local
├── .env.example
├── package.json
├── tsconfig.json
└── README.md


The structure may vary depending on the existing implementation.

⚙️ Installation and Setup
Prerequisites

Make sure you have installed:

Node.js
npm
Git
VS Code or another code editor
1. Clone the Repository
bash
git clone YOUR_REPOSITORY_URL


Navigate to the project:

bash
cd ai-home-decoration

2. Install Dependencies
bash
npm install

3. Configure Environment Variables

Create a .env.local file in the project root.

Add the following configuration:

env
# Google Gemini API

GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=your_available_gemini_model


# Supabase Configuration

NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url

NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key

SUPABASE_SECRET_KEY=your_supabase_secret_key


# Image Generation Service

COMFYUI_URL=http://127.0.0.1:8188


Replace the placeholder values with your actual credentials.

Security: Never commit .env.local or expose secret API keys in frontend code.

4. Start the Development Server
bash
npm run dev


Open your browser:

text
http://localhost:3000

🔑 API Configuration
Google Gemini

Google Gemini is used for:

Understanding uploaded room photographs.
Identifying existing furniture and appliances.
Analysing room layouts.
Processing decoration instructions.
Creating structured image-editing prompts.

Get your API key:

https://aistudio.google.com/api-keys

Note: Gemini API availability and free-tier quotas depend on the selected model and account. Image-generation models may require billing.

Supabase

Supabase is used for:

Database management.
Image storage.
Project management.
User authentication.
Saving original and modified images.

Create a free Supabase project:

https://supabase.com/dashboard

Image Generation

The application is designed to support ComfyUI and compatible open-source image-generation models.

ComfyUI:

https://github.com/comfy-org/ComfyUI

SDXL:

https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0

Image generation requires a compatible model and workflow. ComfyUI is optional until image-generation integration is configured.

🔄 How the Application Works

The intended user workflow:

text
1. Upload Room Photograph
          |
          v
2. Select Room Category
          |
          v
3. Analyse Room Using Gemini
          |
          v
4. Enter Decoration Instructions
          |
          v
5. Select Interior Design Style
          |
          v
6. Generate Modified Image
          |
          v
7. Compare Before and After
          |
          v
8. Save or Download Design

Example: Kitchen Decoration

Original Image:

The user uploads an existing kitchen photograph.

User Instructions:

"Add a modern built-in oven below the countertop. Place a dustbin underneath the sink. Change the kitchen cabinets to white."

Design Style:

Modern.

AI Processing:

Gemini analyses the original kitchen and prepares structured editing instructions.

The configured image-generation engine uses the original photograph and editing instructions to create a redesigned kitchen.

Expected Result:

A modified kitchen photograph that visualizes the requested changes while preserving the existing layout wherever possible.

🔐 Security

The application follows these security principles:

API credentials stored in environment variables.
Server-side AI API requests.
Supabase Row Level Security.
Secure image storage.
File upload validation.
Request validation.
Protected user projects.
No exposure of secret credentials in browser code.
🗺️ Development Roadmap
Initial Next.js frontend.
Dashboard interface.
Sidebar navigation.
Image upload interface.
Decoration prompt interface.
Gemini API configuration.
Supabase API configuration.
Complete Gemini image analysis.
Complete Supabase image storage.
Integrate actual AI image generation.
Implement image inpainting.
Implement selected-area editing.
Implement before/after comparison.
Complete project management.
Improve image-generation performance.
Production deployment.
💡 Future Enhancements

Potential future features include:

AI-powered furniture placement.
Object removal and replacement.
Virtual furniture visualization.
Room colour customization.
Multiple design variations.
Advanced image masking.
Interior design recommendations.
Estimated furniture and renovation costs.
3D room visualization.
Downloadable design reports.
🤝 Contributing

Contributions, suggestions and improvements are welcome.

If you find an issue or have an idea for a new feature, feel free to open an issue or submit a pull request.

📄 License

This project is currently under development.

A suitable open-source license can be added before public distribution.

👨‍💻 Project Status

Status: Active Development

AI Home Decoration aims to make interior design visualization easier, more affordable and accessible through artificial intelligence.

The goal is simple:

Upload your room. Describe your dream design. Visualize your transformed home.

Built with ❤️ using Next.js, Gemini AI and Supabase.