// // src/app/analytics/[id]/page.tsx
// "use client";

// import useSWR from "swr";
// import {
//   Table,
//   TableHeader,
//   TableBody,
//   TableHead,
//   TableRow,
//   TableCell,
// } from "@/components/ui/table";

// export default function AnalyticsPage({ params }: { params: { id: string } }) {
//   const { data, error } = useSWR(
//     `/api/analytics/bounty/${params.id}`,
//     (url: any) => fetch(url).then((r) => r.json())
//   );

//   if (!data) return <p>Loading analytics…</p>;
//   return (
//     <div className="p-8">
//       <h2 className="text-2xl font-bold">Analytics for Bounty #{params.id}</h2>
//       <p>Total Revenue: {data.totalRevenue.toFixed(4)} ETH</p>
//       <p>Submissions Paid: {data.submissions}</p>
//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>ID</TableHead>
//             <TableHead>Payment ID</TableHead>
//             <TableHead>Amount</TableHead>
//             <TableHead>CID</TableHead>
//             <TableHead>Timestamp</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {data.payments.map((p: any, i: number) => (
//             <TableRow key={i}>
//               <TableCell>{i + 1}</TableCell>
//               <TableCell>{p.paymentId}</TableCell>
//               <TableCell>{p.amount.toFixed(4)}</TableCell>
//               <TableCell>{p.cid}</TableCell>
//               <TableCell>{new Date(p.timestamp).toLocaleString()}</TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </div>
//   );
// }
