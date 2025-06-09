// ProjectCard.tsx


type ProjectCardProps = {
  image: string;
  title: string;
  description: string;
};

export default function ProjectCard({ image, title, description }: ProjectCardProps) {
  return (
    <div className="project-card">
      <img src={image} alt={title} />
      <div className="caption">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}
