export default function DocumentPage({
  params,
}: {
  params: { documentId: string };
}) {
  return <div className="pt-16">Document id: {params.documentId}</div>;
}
