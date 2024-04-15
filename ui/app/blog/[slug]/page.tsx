export default function Page({ params }: { params: { slug: string } }) {
  return <div className="container">My Blog: {params.slug}</div>
}