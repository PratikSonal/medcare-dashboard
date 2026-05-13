import { useMemo } from "react";
import { motion } from "framer-motion";
import { useAppSelector } from "@/hooks/useAppDispatch";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";
import { item, STATUS_CELLS } from "../constants";

export const DoctorPerformance = () => {
  const patients = useAppSelector(s => s.patients.patients);

  const doctorData = useMemo(() => {
    const map: Record<
      string,
      {
        total: number;
        active: number;
        critical: number;
        recovering: number;
        discharged: number;
        depts: Set<string>;
      }
    > = {};
    patients.forEach(p => {
      if (!map[p.doctor])
        map[p.doctor] = {
          total: 0,
          active: 0,
          critical: 0,
          recovering: 0,
          discharged: 0,
          depts: new Set(),
        };
      map[p.doctor].total++;
      map[p.doctor].depts.add(p.department);
      if (p.status === "Active") map[p.doctor].active++;
      else if (p.status === "Critical") map[p.doctor].critical++;
      else if (p.status === "Recovering") map[p.doctor].recovering++;
      else if (p.status === "Discharged") map[p.doctor].discharged++;
    });
    return Object.entries(map)
      .map(([name, d]) => ({ name, ...d, depts: Array.from(d.depts) }))
      .sort((a, b) => b.total - a.total);
  }, [patients]);

  return (
    <motion.div variants={item} className="glass-card rounded-20 p-6">
      <div className="mb-5">
        <h2 className="text-base font-semibold text-text-primary">Doctor Performance</h2>
        <p className="text-[13px] text-text-secondary mt-[2px]">
          Patient load and status breakdown per physician
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[13px]" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr className="border-b border-border-primary">
              {[
                "Doctor",
                "Total",
                "Active",
                "Critical",
                "Recovering",
                "Discharged",
                "Departments",
              ].map(h => (
                <th
                  key={h}
                  className="text-left px-3 py-2 text-[11px] font-semibold text-text-tertiary uppercase tracking-[0.05em] whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {doctorData.map((d, i) => (
              <motion.tr
                key={d.name}
                whileHover={{ x: 4, transition: { duration: 0.3, ease: "easeOut" } }}
                className={cn(
                  "cursor-pointer transition-colors duration-200 hover:bg-bg-tertiary",
                  i < doctorData.length - 1 && "border-b border-border-primary",
                )}
              >
                <td className="px-3 py-3">
                  <div className="flex items-center gap-[10px]">
                    <Avatar
                      initials={d.name
                        .split(" ")
                        .slice(1)
                        .map(n => n[0])
                        .join("")
                        .slice(0, 2)}
                      size={32}
                      radius="50%"
                    />
                    <span className="font-medium text-text-primary whitespace-nowrap">
                      {d.name}
                    </span>
                  </div>
                </td>
                <td className="px-3 py-3">
                  <span className="text-[15px] font-bold text-text-primary">{d.total}</span>
                </td>
                {STATUS_CELLS.map(({ key, bg, color }) => (
                  <td key={key} className="px-3 py-3">
                    {d[key] ? (
                      <span
                        className="text-xs font-semibold px-2 py-[3px] rounded-[6px]"
                        style={{ background: bg, color }}
                      >
                        {d[key]}
                      </span>
                    ) : (
                      <span className="text-xs text-text-tertiary">—</span>
                    )}
                  </td>
                ))}
                <td className="px-3 py-3">
                  <div className="flex flex-wrap gap-1">
                    {d.depts.map(dept => (
                      <span
                        key={dept}
                        className="text-[10px] font-medium px-[7px] py-[2px] rounded-[4px] bg-bg-tertiary text-text-secondary whitespace-nowrap"
                      >
                        {dept}
                      </span>
                    ))}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};
