import Image from "next/image";

export default async function ProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${id}`, {
    cache: "no-store",
  });
  const json = await res.json();
  const project = json.data;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Thumbnail + Title */}
      <div className="flex flex-col md:flex-row items-center gap-6">
        {project.thumbnail && (
          <div className="w-full md:w-1/3 rounded-xl overflow-hidden shadow-lg">
            <Image
              src={`${process.env.NEXT_PUBLIC_FILE_API}${project.thumbnail}`}
              alt={project.projectName}
              width={400}
              height={400}
              className="object-cover w-full h-full"
            />
          </div>
        )}
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{project.projectName}</h1>
          <p className="text-foreground text-lg">{project.title}</p>
        </div>
      </div>

      {/* Description */}
      <section className="bg-background p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Project Description</h2>
        <p className="text-foreground whitespace-pre-line">
          {project.description}
        </p>
      </section>

      {/* Requirements */}
      {project.requirements?.length > 0 && (
        <section className="bg-background p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Project Requirements</h2>
          <ul className="list-disc list-inside space-y-2 text-foreground">
            {project.requirements.map((req: string,  idx: number) => (
              <li key={idx}>{req}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Technologies */}
      {project.technologies?.length > 0 && (
        <section className="bg-background p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Technologies Used</h2>
          <div className="flex flex-wrap gap-3">
            {project.technologies.map((tech: string,  idx: number) => (
              <span
                key={idx}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Gallery */}
      {project.gallery?.length > 0 && (
        <section className="bg-background p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Project Gallery</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {project.gallery.map((img: string, idx: number) => (
              <div key={idx} className="rounded-xl overflow-hidden shadow-md">
                <Image
                  src={`${process.env.NEXT_PUBLIC_FILE_API}${img}`}
                  alt={`Gallery ${idx + 1}`}
                  width={400}
                  height={300}
                  className="object-cover w-full h-48"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Demo Video */}
      {project.demoVideo && (
        <section className="bg-background p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Demo Video</h2>
          <video
            src={`${process.env.NEXT_PUBLIC_FILE_API}${project.demoVideo}`}
            controls
            className="w-full rounded-xl shadow-lg"
          />
        </section>
      )}
    </div>
  );
}
