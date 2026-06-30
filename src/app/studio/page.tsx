"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Project } from "@/lib/projects";
import { Btn } from "./fields";
import { StudioEditor, makeNewProject } from "./StudioEditor";

type SaveState = "idle" | "dirty" | "saving" | "saved" | "error";

export default function StudioPage() {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [source, setSource] = useState<string>("");
  const [save, setSave] = useState<SaveState>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/studio/data")
      .then((r) => r.json())
      .then((d: { projects: Project[]; source: string }) => {
        setProjects(d.projects);
        setSource(d.source);
        setSelected(d.projects[0]?.slug ?? null);
      })
      .catch(() => setError("Failed to load project data."));
  }, []);

  const current = useMemo(
    () => projects?.find((p) => p.slug === selected) ?? null,
    [projects, selected],
  );

  const updateProject = (next: Project) => {
    setProjects((prev) =>
      prev ? prev.map((p) => (p.slug === selected ? next : p)) : prev,
    );
    // keep selection in sync if the slug changed
    if (next.slug !== selected) setSelected(next.slug);
    setSave("dirty");
  };

  const addProject = () => {
    if (!projects) return;
    const base = "new-project";
    let slug = base;
    let n = 1;
    while (projects.some((p) => p.slug === slug)) slug = `${base}-${n++}`;
    const np = makeNewProject(slug);
    setProjects([...projects, np]);
    setSelected(slug);
    setSave("dirty");
  };

  const deleteProject = (slug: string) => {
    if (!projects) return;
    if (!confirm(`Delete project "${slug}"? This cannot be undone after saving.`))
      return;
    const next = projects.filter((p) => p.slug !== slug);
    setProjects(next);
    if (selected === slug) setSelected(next[0]?.slug ?? null);
    setSave("dirty");
  };

  const doSave = async () => {
    if (!projects) return;
    // guard duplicate / empty slugs client-side for a friendlier message
    const slugs = projects.map((p) => p.slug.trim());
    if (slugs.some((s) => !s)) {
      setError("Every project needs a slug.");
      setSave("error");
      return;
    }
    if (new Set(slugs).size !== slugs.length) {
      setError("Duplicate slugs detected.");
      setSave("error");
      return;
    }
    setSave("saving");
    setError(null);
    try {
      const res = await fetch("/api/studio/data", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ projects }),
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.error ?? `HTTP ${res.status}`);
      }
      setSave("saved");
      setSource("studio");
      setTimeout(() => setSave((s) => (s === "saved" ? "idle" : s)), 2500);
    } catch (e) {
      setError((e as Error).message);
      setSave("error");
    }
  };

  if (error && !projects) {
    return <div className="p-10 text-red-300">{error}</div>;
  }
  if (!projects) {
    return <div className="p-10 text-white/50">Loading studio…</div>;
  }

  return (
    <div className="flex min-h-screen">
      {/* sidebar */}
      <aside className="flex w-72 shrink-0 flex-col border-r border-[#222] bg-[#070707]">
        <div className="flex items-center justify-between border-b border-[#222] px-4 py-4">
          <div>
            <h1 className="text-sm font-semibold tracking-wide text-[#c19b4d]">
              STUDIO
            </h1>
            <p className="text-[11px] text-white/30">
              local only · {source === "seed" ? "seed data" : "edited data"}
            </p>
          </div>
        </div>
        <div className="flex-1 overflow-auto py-2">
          {projects.map((p) => (
            <button
              key={p.slug}
              onClick={() => setSelected(p.slug)}
              className={`flex w-full flex-col items-start gap-0.5 px-4 py-2.5 text-left transition-colors ${
                selected === p.slug
                  ? "bg-[#161105] text-white"
                  : "text-white/60 hover:bg-[#111] hover:text-white"
              }`}
            >
              <span className="text-sm">{p.name || "(untitled)"}</span>
              <span className="text-[11px] text-white/30">/{p.slug}</span>
            </button>
          ))}
        </div>
        <div className="border-t border-[#222] p-3">
          <Btn onClick={addProject}>+ Add project</Btn>
        </div>
      </aside>

      {/* main */}
      <main className="flex-1 overflow-auto">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-[#222] bg-black/90 px-6 py-3 backdrop-blur">
          <div className="flex items-center gap-3">
            {current ? (
              <>
                <Link
                  href={`/project/${current.slug}`}
                  target="_blank"
                  className="text-xs text-white/50 underline hover:text-[#c19b4d]"
                >
                  Preview /project/{current.slug} ↗
                </Link>
                <Btn variant="danger" onClick={() => deleteProject(current.slug)}>
                  Delete project
                </Btn>
              </>
            ) : (
              <span className="text-sm text-white/40">No project selected</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {error ? (
              <span className="text-xs text-red-400">{error}</span>
            ) : null}
            <span className="text-xs text-white/40">
              {save === "dirty"
                ? "Unapplied changes"
                : save === "saving"
                ? "Applying…"
                : save === "saved"
                ? "Applied ✓ — ready to commit"
                : save === "error"
                ? "Apply failed"
                : ""}
            </span>
            <Btn
              variant="gold"
              onClick={doSave}
              disabled={save === "saving" || save === "idle"}
            >
              Apply changes
            </Btn>
          </div>
        </header>

        <div className="px-6 py-6">
          {current ? (
            <StudioEditor project={current} onChange={updateProject} />
          ) : (
            <p className="text-white/40">Select or add a project to begin.</p>
          )}
        </div>
      </main>
    </div>
  );
}
