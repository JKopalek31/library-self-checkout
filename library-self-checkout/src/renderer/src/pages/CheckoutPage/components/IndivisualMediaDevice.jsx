// import React from 'react'

// const IndivisualMediaDevice = () => {
//   return (
//     <div className="text-2xl p-1">
//         <table className="border-2 w-full h-full">
//             <tr className="border-2">
//                 <td className="border-2 py-0 px-0 font-semibold">Book Title </td>
//                 <td>Value 2</td>
//             </tr>
//             <tr className="border-2">
//                 <td className="border-2 py-0 px-0 font-semibold">Author</td>
//                 <td>Value 2</td>
//             </tr>
//             <tr className="border-2">
//                 <td className="border-2 py-0 px-0 font-semibold">ISBN</td>
//                 <td>Value 3</td>
//             </tr>
//         </table>

//     </div>
//   )
// }

// export default IndivisualMediaDevice


import React from 'react'

const IndivisualMediaDevice = () => {
  return (
    <div className="w-full h-full p-1">
      <table className="w-full h-full table-fixed border border-gray-500">
        <tbody>
          <tr className="border-t border-gray-500">
            <td className="border-r border-gray-500 px-1 py-1 font-semibold text-xl">
              Book Title
            </td>
            <td className="px-1 py-1 text-[clamp(10px,1.5vw,18px)]">
              Cool book or some kind of media device scanned in the system 
            </td>
          </tr>
          <tr className="border-t border-gray-500">
            <td className="border-r border-gray-500 px-1 py-1 font-semibold text-xl">
              Author
            </td>
            <td className="px-1 py-1 text-[clamp(10px,1.5vw,18px)]">
              Someone famous or not whoever it is
            </td>
          </tr>
          <tr className="border-t border-gray-500">
            <td className="border-r border-gray-500 px-1 py-1 font-semibold text-xl">
              ISBN
            </td>
            <td className="px-1 py-1 text-[clamp(10px,1.5vw,18px)]">
              1010101010101
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default IndivisualMediaDevice


// const TChart = ({ data = [] }) => {
//     const rows = data.slice(0, 5);
//     while (rows.length < 5) rows.push({ label: "", value: "" });
  
//     return (
//       <div className="w-full h-full rounded-md mx-auto p-4 bg-white">
  
//         {/* Outer border for the whole chart */}
//         <div className="border border-gray-300 rounded-md overflow-hidden">
//           {rows.map((row, idx) => (
//             <div
//               key={idx}
//               className={
//                 "flex w-full" +
//                 (idx !== rows.length - 1 ? " border-b border-gray-300" : "")
//               }
//             >
//               {/* Left cell (label) with right‑side border to form the vertical line */}
//               <div className="w-1/2 px-3 py-2 border-r border-gray-300 text-sm font-medium text-gray-700 truncate">
//                 {row.label}
//               </div>
//               {/* Right cell (value) */}
//               <div className="w-1/2 px-3 py-2 text-right text-sm font-semibold text-gray-800 truncate">
//                 {row.value}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   };

//   export const Example = () => {
//     const data = [
//       { label: "Assets", value: "$120k" },
//       { label: "Liabilities", value: "$45k" },
//       { label: "Equity", value: "$75k" },
//       { label: "Revenue", value: "$60k" },
//       { label: "Expenses", value: "$30k" },
//     ];
  
//     return <TChart data={data} />;
//   };
  
//   export default TChart;