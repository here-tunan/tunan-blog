export default function Page({ params }: { params: { slug: string } }) {
  return <div className="container">My Project: {params.slug}</div>
}