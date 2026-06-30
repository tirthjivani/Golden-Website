"use client";

import { useState } from "react";
import {
  DEFAULT_SECTION_ORDER,
  SECTION_DEFS,
  type AmenityKey,
  type CustomSection,
  type FloorPlan,
  type FloorPlanGroup,
  type ImageRef,
  type Landmark,
  type LandmarkCategory,
  type Pillar,
  type Project,
  type ProjectDetail,
} from "@/lib/projects";
import {
  Btn,
  Field,
  ImageField,
  ImageListField,
  NumberField,
  SelectField,
  TextArea,
  TextField,
  Toggle,
} from "./fields";

const LANDMARK_CATEGORIES: LandmarkCategory[] = [
  "education",
  "healthcare",
  "recreation",
  "transit",
];

const PILLAR_ICONS: Pillar["iconKey"][] = [
  "zero-out",
  "smart-power",
  "climate-capsule",
  "zero-waste",
];

const AMENITY_KEYS: AmenityKey[] = [
  "walking-track",
  "security",
  "solar-power",
  "garden",
  "play-area",
  "elevators",
  "parking",
  "gym",
  "pool",
  "clubhouse",
  "library",
];

export function StudioEditor({
  project,
  onChange,
}: {
  project: Project;
  onChange: (p: Project) => void;
}) {
  const detail = project.detail;

  return (
    <div className="flex flex-col gap-8 pb-32">
      <MetaEditor project={project} onChange={onChange} />
      {detail ? (
        <SectionManager project={project} onChange={onChange} />
      ) : (
        <p className="text-sm text-white/50">
          This project has no detail page. Add one to edit sections.
          <span className="ml-2">
            <Btn
              variant="gold"
              onClick={() => onChange({ ...project, detail: emptyDetail() })}
            >
              + Add detail page
            </Btn>
          </span>
        </p>
      )}
    </div>
  );
}

/* ---------------- meta ---------------- */

function MetaEditor({
  project,
  onChange,
}: {
  project: Project;
  onChange: (p: Project) => void;
}) {
  const set = (patch: Partial<Project>) => onChange({ ...project, ...patch });
  return (
    <section className="rounded-sm border border-[#2a2a2a] bg-[#0a0a0a] p-5">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[#c19b4d]">
        Project details
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <TextField label="Name" value={project.name} onChange={(v) => set({ name: v })} />
        <TextField
          label="Slug"
          value={project.slug}
          hint="URL: /project/<slug> — must be unique"
          onChange={(v) => set({ slug: v })}
        />
        <SelectField
          label="Type"
          value={project.type}
          options={[
            { value: "residential", label: "Residential" },
            { value: "commercial-industrial", label: "Commercial / Industrial" },
          ]}
          onChange={(v) => set({ type: v })}
        />
        <TextField label="Category" value={project.category} onChange={(v) => set({ category: v })} />
        <TextField label="Location" value={project.location} onChange={(v) => set({ location: v })} />
        <SelectField
          label="Status"
          value={project.status}
          options={[
            { value: "Completed", label: "Completed" },
            { value: "Ongoing", label: "Ongoing" },
            { value: "Upcoming", label: "Upcoming" },
          ]}
          onChange={(v) => set({ status: v })}
        />
        <TextField label="Area" value={project.area} onChange={(v) => set({ area: v })} />
        <TextField label="Area label" value={project.areaLabel} onChange={(v) => set({ areaLabel: v })} />
        <TextField label="RERA" value={project.rera} onChange={(v) => set({ rera: v })} />
        <TextField
          label="RERA issued on"
          value={project.reraIssuedOn}
          onChange={(v) => set({ reraIssuedOn: v })}
        />
      </div>
      <div className="mt-4">
        <ImageListField
          label="Listing images"
          items={project.images}
          slug={project.slug}
          onChange={(items) => set({ images: items })}
        />
      </div>
    </section>
  );
}

/* ---------------- section manager ---------------- */

function SectionManager({
  project,
  onChange,
}: {
  project: Project;
  onChange: (p: Project) => void;
}) {
  const [openKey, setOpenKey] = useState<string | null>(null);

  const custom = project.customSections ?? [];
  const customKeys = custom.map((c) => `custom:${c.id}`);
  const baseOrder =
    project.sectionOrder && project.sectionOrder.length > 0
      ? project.sectionOrder.slice()
      : DEFAULT_SECTION_ORDER.slice();
  // ensure every custom section appears
  for (const k of customKeys) if (!baseOrder.includes(k)) baseOrder.push(k);
  // drop stale keys (deleted custom sections)
  const order = baseOrder.filter(
    (k) => !k.startsWith("custom:") || customKeys.includes(k),
  );

  const disabled = new Set(project.disabledSections ?? []);

  const commitOrder = (next: string[]) =>
    onChange({ ...project, sectionOrder: next });

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= order.length) return;
    const next = order.slice();
    [next[i], next[j]] = [next[j], next[i]];
    commitOrder(next);
  };

  const toggle = (key: string) => {
    const next = new Set(disabled);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    onChange({ ...project, disabledSections: Array.from(next) });
  };

  const addCustom = () => {
    const used = new Set(custom.map((c) => c.id));
    let n = 1;
    let id = `s${n}`;
    while (used.has(id)) id = `s${++n}`;
    const nextCustom: CustomSection[] = [
      ...custom,
      { id, label: "New Section", headline: "New Section", body: "", media: [] },
    ];
    onChange({
      ...project,
      customSections: nextCustom,
      sectionOrder: [...order, `custom:${id}`],
    });
    setOpenKey(`custom:${id}`);
  };

  const deleteCustom = (id: string) => {
    onChange({
      ...project,
      customSections: custom.filter((c) => c.id !== id),
      sectionOrder: order.filter((k) => k !== `custom:${id}`),
    });
  };

  const labelFor = (key: string) => {
    if (key.startsWith("custom:")) {
      const c = custom.find((x) => `custom:${x.id}` === key);
      return c?.label || c?.headline || "Custom section";
    }
    return SECTION_DEFS.find((s) => s.key === key)?.label ?? key;
  };

  return (
    <section className="rounded-sm border border-[#2a2a2a] bg-[#0a0a0a] p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[#c19b4d]">
          Sections
        </h2>
        <Btn variant="gold" onClick={addCustom}>
          + Custom section
        </Btn>
      </div>

      <div className="flex flex-col gap-2">
        {order.map((key, i) => {
          const isCustom = key.startsWith("custom:");
          const off = disabled.has(key);
          const open = openKey === key;
          return (
            <div
              key={key}
              className={`rounded-sm border ${
                open ? "border-[#c19b4d]" : "border-[#2a2a2a]"
              } bg-[#0c0c0c]`}
            >
              <div className="flex items-center gap-3 px-3 py-2.5">
                <div className="flex flex-col">
                  <button
                    onClick={() => move(i, -1)}
                    className="text-white/40 hover:text-white"
                    title="Move up"
                  >
                    ▲
                  </button>
                  <button
                    onClick={() => move(i, 1)}
                    className="text-white/40 hover:text-white"
                    title="Move down"
                  >
                    ▼
                  </button>
                </div>
                <span
                  className={`flex-1 text-sm ${off ? "text-white/30 line-through" : "text-white"}`}
                >
                  {labelFor(key)}
                  {isCustom ? (
                    <span className="ml-2 rounded-sm bg-[#1f1a10] px-1.5 py-0.5 text-[10px] text-[#c19b4d]">
                      custom
                    </span>
                  ) : null}
                </span>
                <Toggle checked={!off} onChange={() => toggle(key)} />
                <Btn onClick={() => setOpenKey(open ? null : key)}>
                  {open ? "Close" : "Edit"}
                </Btn>
                {isCustom ? (
                  <Btn
                    variant="danger"
                    onClick={() => deleteCustom(key.slice("custom:".length))}
                  >
                    Delete
                  </Btn>
                ) : null}
              </div>
              {open ? (
                <div className="border-t border-[#222] p-4">
                  <SectionBody
                    sectionKey={key}
                    project={project}
                    onChange={onChange}
                  />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ---------------- per-section bodies ---------------- */

function SectionBody({
  sectionKey,
  project,
  onChange,
}: {
  sectionKey: string;
  project: Project;
  onChange: (p: Project) => void;
}) {
  const detail = project.detail!;
  const slug = project.slug;
  const setDetail = (patch: Partial<ProjectDetail>) =>
    onChange({ ...project, detail: { ...detail, ...patch } });

  if (sectionKey.startsWith("custom:")) {
    const id = sectionKey.slice("custom:".length);
    const list = project.customSections ?? [];
    const cs = list.find((c) => c.id === id);
    if (!cs) return null;
    const setCs = (patch: Partial<CustomSection>) =>
      onChange({
        ...project,
        customSections: list.map((c) => (c.id === id ? { ...c, ...patch } : c)),
      });
    return <CustomEditor section={cs} slug={slug} setCs={setCs} />;
  }

  switch (sectionKey) {
    case "hero":
      return (
        <Group>
          <ImageField
            label="Hero image"
            value={detail.hero.image}
            slug={slug}
            onChange={(v) =>
              setDetail({ hero: { ...detail.hero, image: v ?? { src: "" } } })
            }
          />
          <TextField
            label="Eyebrow"
            value={detail.hero.eyebrow}
            onChange={(v) => setDetail({ hero: { ...detail.hero, eyebrow: v } })}
          />
          <TextField
            label="Tagline"
            value={detail.hero.tagline}
            onChange={(v) => setDetail({ hero: { ...detail.hero, tagline: v } })}
          />
        </Group>
      );

    case "facts":
      return (
        <p className="text-sm text-white/50">
          The Facts strip is generated from the project details above (location,
          type, area, RERA, status). Edit those fields to change it.
        </p>
      );

    case "overview": {
      const summary = detail.summary ?? { cards: [] };
      const intro = detail.intro;
      return (
        <Group>
          <TextField
            label="Intro headline"
            value={intro.headline}
            onChange={(v) => setDetail({ intro: { ...intro, headline: v } })}
          />
          <TextArea
            label="Intro body"
            value={intro.body}
            onChange={(v) => setDetail({ intro: { ...intro, body: v } })}
          />
          <TextField
            label="Brochure URL"
            value={intro.brochureUrl}
            hint="e.g. /brochures/<slug>.pdf — shows a download button (residential)"
            onChange={(v) => setDetail({ intro: { ...intro, brochureUrl: v } })}
          />
          <TextField
            label="Cards headline (optional)"
            value={summary.headline}
            onChange={(v) =>
              setDetail({ summary: { ...summary, headline: v } })
            }
          />
          <CardListEditor
            cards={summary.cards}
            slug={slug}
            onChange={(cards) => setDetail({ summary: { ...summary, cards } })}
          />
        </Group>
      );
    }

    case "highlights": {
      const h = detail.highlights ?? { headline: "", items: [] };
      return (
        <Group>
          <TextField
            label="Headline"
            value={h.headline}
            onChange={(v) => setDetail({ highlights: { ...h, headline: v } })}
          />
          <TextArea
            label="Body"
            value={h.body}
            onChange={(v) => setDetail({ highlights: { ...h, body: v } })}
          />
          <ImageListField
            label="Images"
            items={h.items}
            slug={slug}
            onChange={(items) => setDetail({ highlights: { ...h, items } })}
          />
        </Group>
      );
    }

    case "amenities": {
      const a = detail.amenities;
      const setItem = (i: number, key: AmenityKey, label: string) => {
        const items = a.items.slice();
        items[i] = { key, label };
        setDetail({ amenities: { ...a, items } });
      };
      return (
        <Group>
          <TextField
            label="Headline"
            value={a.headline}
            onChange={(v) => setDetail({ amenities: { ...a, headline: v } })}
          />
          <TextArea
            label="Body"
            value={a.body}
            onChange={(v) => setDetail({ amenities: { ...a, body: v } })}
          />
          <ImageField
            label="Feature image"
            value={a.feature}
            slug={slug}
            onChange={(v) => setDetail({ amenities: { ...a, feature: v } })}
          />
          <Field label={`Amenity items (${a.items.length})`}>
            <div className="flex flex-col gap-2">
              {a.items.map((it, i) => (
                <div key={i} className="flex items-center gap-2">
                  <select
                    className="rounded-sm border border-[#464646] bg-[#0c0c0c] px-2 py-2 text-sm text-white"
                    value={it.key}
                    onChange={(e) =>
                      setItem(i, e.target.value as AmenityKey, it.label)
                    }
                  >
                    {AMENITY_KEYS.map((k) => (
                      <option key={k} value={k}>
                        {k}
                      </option>
                    ))}
                  </select>
                  <input
                    className="flex-1 rounded-sm border border-[#464646] bg-[#0c0c0c] px-3 py-2 text-sm text-white outline-none focus:border-[#c19b4d]"
                    value={it.label}
                    onChange={(e) => setItem(i, it.key, e.target.value)}
                  />
                  <Btn
                    variant="danger"
                    onClick={() =>
                      setDetail({
                        amenities: {
                          ...a,
                          items: a.items.filter((_, j) => j !== i),
                        },
                      })
                    }
                  >
                    ✕
                  </Btn>
                </div>
              ))}
              <Btn
                onClick={() =>
                  setDetail({
                    amenities: {
                      ...a,
                      items: [...a.items, { key: "garden", label: "" }],
                    },
                  })
                }
              >
                + Add amenity
              </Btn>
            </div>
          </Field>
        </Group>
      );
    }

    case "master-plan": {
      const mp = detail.masterPlan ?? { headline: "Master Plan", image: { src: "" } };
      return (
        <Group>
          <TextField
            label="Headline"
            value={mp.headline}
            onChange={(v) => setDetail({ masterPlan: { ...mp, headline: v } })}
          />
          <TextArea
            label="Body"
            value={mp.body}
            onChange={(v) => setDetail({ masterPlan: { ...mp, body: v } })}
          />
          <ImageField
            label="Master plan image"
            value={mp.image}
            slug={slug}
            onChange={(v) =>
              setDetail({ masterPlan: { ...mp, image: v ?? { src: "" } } })
            }
          />
        </Group>
      );
    }

    case "floor-plans": {
      const fp = detail.floorPlans;
      return (
        <Group>
          <TextField
            label="Headline"
            value={fp.headline}
            onChange={(v) => setDetail({ floorPlans: { ...fp, headline: v } })}
          />
          <TextArea
            label="Body"
            value={fp.body}
            onChange={(v) => setDetail({ floorPlans: { ...fp, body: v } })}
          />
          <FloorPlansEditor
            groups={fp.groups ?? []}
            slug={slug}
            onChange={(groups) => setDetail({ floorPlans: { ...fp, groups } })}
          />
        </Group>
      );
    }

    case "specifications": {
      const sp = detail.specifications;
      const setItem = (i: number, patch: Partial<{ id: string; title: string; body: string }>) => {
        const items = sp.items.slice();
        items[i] = { ...items[i], ...patch };
        setDetail({ specifications: { ...sp, items } });
      };
      return (
        <Group>
          <TextField
            label="Headline"
            value={sp.headline}
            onChange={(v) => setDetail({ specifications: { ...sp, headline: v } })}
          />
          <Field label={`Specification items (${sp.items.length})`}>
            <div className="flex flex-col gap-3">
              {sp.items.map((it, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-2 rounded-sm border border-[#2a2a2a] bg-[#0a0a0a] p-3"
                >
                  <input
                    className="rounded-sm border border-[#464646] bg-[#0c0c0c] px-3 py-2 text-sm text-white outline-none focus:border-[#c19b4d]"
                    placeholder="Title"
                    value={it.title}
                    onChange={(e) => setItem(i, { title: e.target.value })}
                  />
                  <textarea
                    className="resize-y rounded-sm border border-[#464646] bg-[#0c0c0c] px-3 py-2 text-sm text-white outline-none focus:border-[#c19b4d]"
                    rows={3}
                    placeholder="Body"
                    value={it.body}
                    onChange={(e) => setItem(i, { body: e.target.value })}
                  />
                  <div>
                    <Btn
                      variant="danger"
                      onClick={() =>
                        setDetail({
                          specifications: {
                            ...sp,
                            items: sp.items.filter((_, j) => j !== i),
                          },
                        })
                      }
                    >
                      Remove
                    </Btn>
                  </div>
                </div>
              ))}
              <Btn
                onClick={() =>
                  setDetail({
                    specifications: {
                      ...sp,
                      items: [
                        ...sp.items,
                        { id: `spec-${sp.items.length + 1}`, title: "", body: "" },
                      ],
                    },
                  })
                }
              >
                + Add specification
              </Btn>
            </div>
          </Field>
        </Group>
      );
    }

    case "gallery": {
      const g = detail.gallery;
      return (
        <Group>
          <TextField
            label="Headline"
            value={g.headline}
            onChange={(v) => setDetail({ gallery: { ...g, headline: v } })}
          />
          <TextArea
            label="Body"
            value={g.body}
            onChange={(v) => setDetail({ gallery: { ...g, body: v } })}
          />
          <ImageListField
            label="Gallery images"
            items={g.images}
            slug={slug}
            onChange={(images) => setDetail({ gallery: { ...g, images } })}
          />
        </Group>
      );
    }

    case "location": {
      const loc =
        detail.location ?? { headline: "Location", coords: [0, 0] as [number, number], landmarks: [] };
      return (
        <Group>
          <TextField
            label="Headline"
            value={loc.headline}
            onChange={(v) => setDetail({ location: { ...loc, headline: v } })}
          />
          <TextArea
            label="Body"
            value={loc.body}
            onChange={(v) => setDetail({ location: { ...loc, body: v } })}
          />
          <TextField
            label="Address"
            value={loc.address}
            onChange={(v) => setDetail({ location: { ...loc, address: v } })}
          />
          <div className="grid grid-cols-2 gap-3">
            <NumberField
              label="Longitude"
              step={0.0001}
              value={loc.coords?.[0]}
              onChange={(v) =>
                setDetail({
                  location: { ...loc, coords: [v ?? 0, loc.coords?.[1] ?? 0] },
                })
              }
            />
            <NumberField
              label="Latitude"
              step={0.0001}
              value={loc.coords?.[1]}
              onChange={(v) =>
                setDetail({
                  location: { ...loc, coords: [loc.coords?.[0] ?? 0, v ?? 0] },
                })
              }
            />
          </div>
          <LandmarksEditor
            items={loc.landmarks ?? []}
            onChange={(landmarks) => setDetail({ location: { ...loc, landmarks } })}
          />
        </Group>
      );
    }

    case "pillars":
      return (
        <Group>
          <PillarsEditor
            items={detail.pillars.items ?? []}
            onChange={(items) => setDetail({ pillars: { items } })}
          />
        </Group>
      );

    case "walkthrough": {
      const w = detail.walkthrough ?? { headline: "Walkthrough", videoUrl: "" };
      return (
        <Group>
          <TextField
            label="Headline"
            value={w.headline}
            onChange={(v) => setDetail({ walkthrough: { ...w, headline: v } })}
          />
          <TextArea
            label="Body"
            value={w.body}
            onChange={(v) => setDetail({ walkthrough: { ...w, body: v } })}
          />
          <TextField
            label="Video URL"
            value={w.videoUrl}
            hint="YouTube watch/share/embed link"
            onChange={(v) => setDetail({ walkthrough: { ...w, videoUrl: v } })}
          />
        </Group>
      );
    }

    default:
      return null;
  }
}

/* ---------------- sub-editors ---------------- */

function CustomEditor({
  section,
  slug,
  setCs,
}: {
  section: CustomSection;
  slug: string;
  setCs: (patch: Partial<CustomSection>) => void;
}) {
  return (
    <Group>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <TextField
          label="Nav label"
          value={section.label}
          onChange={(v) => setCs({ label: v })}
        />
        <SelectField
          label="Media columns"
          value={String(section.columns ?? 3)}
          options={[
            { value: "2", label: "2 columns" },
            { value: "3", label: "3 columns" },
            { value: "4", label: "4 columns" },
          ]}
          onChange={(v) => setCs({ columns: Number(v) as 2 | 3 | 4 })}
        />
      </div>
      <TextField
        label="Headline"
        value={section.headline}
        onChange={(v) => setCs({ headline: v })}
      />
      <TextArea
        label="Body"
        rows={4}
        value={section.body}
        onChange={(v) => setCs({ body: v })}
      />
      <ImageListField
        label="Media"
        items={section.media ?? []}
        slug={slug}
        onChange={(media) => setCs({ media })}
      />
      <TextField
        label="Video URL (optional)"
        value={section.videoUrl}
        hint="YouTube link — renders an embed below the media"
        onChange={(v) => setCs({ videoUrl: v })}
      />
    </Group>
  );
}

function CardListEditor({
  cards,
  slug,
  onChange,
}: {
  cards: { src: string; alt?: string; metric: string; label: string }[];
  slug: string;
  onChange: (cards: { src: string; alt?: string; metric: string; label: string }[]) => void;
}) {
  const set = (i: number, patch: Partial<(typeof cards)[number]>) => {
    const next = cards.slice();
    next[i] = { ...next[i], ...patch };
    onChange(next);
  };
  return (
    <Field label={`Overview cards (${cards.length})`}>
      <div className="flex flex-col gap-3">
        {cards.map((c, i) => (
          <div
            key={i}
            className="flex flex-col gap-2 rounded-sm border border-[#2a2a2a] bg-[#0a0a0a] p-3"
          >
            <ImageField
              label={`Card ${i + 1} image`}
              value={{ src: c.src, alt: c.alt }}
              slug={slug}
              withMeta={false}
              onChange={(v) => set(i, { src: v?.src ?? "", alt: v?.alt })}
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                className="rounded-sm border border-[#464646] bg-[#0c0c0c] px-3 py-2 text-sm text-white outline-none focus:border-[#c19b4d]"
                placeholder="metric (e.g. Tavra, Bharuch)"
                value={c.metric}
                onChange={(e) => set(i, { metric: e.target.value })}
              />
              <input
                className="rounded-sm border border-[#464646] bg-[#0c0c0c] px-3 py-2 text-sm text-white outline-none focus:border-[#c19b4d]"
                placeholder="label (e.g. Location)"
                value={c.label}
                onChange={(e) => set(i, { label: e.target.value })}
              />
            </div>
            <div>
              <Btn
                variant="danger"
                onClick={() => onChange(cards.filter((_, j) => j !== i))}
              >
                Remove card
              </Btn>
            </div>
          </div>
        ))}
        <Btn
          onClick={() =>
            onChange([...cards, { src: "", metric: "", label: "" }])
          }
        >
          + Add card
        </Btn>
      </div>
    </Field>
  );
}

/* ---------------- reusable list primitives ---------------- */

// Small list of free-text strings (e.g. plan feature bullets).
function StringListField({
  label,
  items,
  placeholder,
  onChange,
}: {
  label: string;
  items: string[];
  placeholder?: string;
  onChange: (items: string[]) => void;
}) {
  const set = (i: number, v: string) => {
    const next = items.slice();
    next[i] = v;
    onChange(next);
  };
  return (
    <Field label={`${label} (${items.length})`}>
      <div className="flex flex-col gap-2">
        {items.map((it, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              className="flex-1 rounded-sm border border-[#464646] bg-[#0c0c0c] px-3 py-2 text-sm text-white outline-none focus:border-[#c19b4d]"
              placeholder={placeholder}
              value={it}
              onChange={(e) => set(i, e.target.value)}
            />
            <Btn
              variant="danger"
              onClick={() => onChange(items.filter((_, j) => j !== i))}
            >
              ✕
            </Btn>
          </div>
        ))}
        <Btn onClick={() => onChange([...items, ""])}>+ Add</Btn>
      </div>
    </Field>
  );
}

// List of { label, value } pairs (e.g. plan metrics).
function MetricsField({
  items,
  onChange,
}: {
  items: { label: string; value: string }[];
  onChange: (items: { label: string; value: string }[]) => void;
}) {
  const set = (
    i: number,
    patch: Partial<{ label: string; value: string }>,
  ) => {
    const next = items.slice();
    next[i] = { ...next[i], ...patch };
    onChange(next);
  };
  return (
    <Field label={`Metrics (${items.length})`}>
      <div className="flex flex-col gap-2">
        {items.map((it, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              className="flex-1 rounded-sm border border-[#464646] bg-[#0c0c0c] px-3 py-2 text-sm text-white outline-none focus:border-[#c19b4d]"
              placeholder="label (e.g. Carpet area)"
              value={it.label}
              onChange={(e) => set(i, { label: e.target.value })}
            />
            <input
              className="flex-1 rounded-sm border border-[#464646] bg-[#0c0c0c] px-3 py-2 text-sm text-white outline-none focus:border-[#c19b4d]"
              placeholder="value (e.g. 1240 sq.ft.)"
              value={it.value}
              onChange={(e) => set(i, { value: e.target.value })}
            />
            <Btn
              variant="danger"
              onClick={() => onChange(items.filter((_, j) => j !== i))}
            >
              ✕
            </Btn>
          </div>
        ))}
        <Btn onClick={() => onChange([...items, { label: "", value: "" }])}>
          + Add metric
        </Btn>
      </div>
    </Field>
  );
}

/* ---------------- floor plans ---------------- */

function emptyPlan(n: number): FloorPlan {
  return {
    id: `plan-${n}`,
    label: "New plan",
    metrics: [{ label: "Carpet area", value: "" }],
    features: [],
    image: { src: "" },
  };
}

function FloorPlansEditor({
  groups,
  slug,
  onChange,
}: {
  groups: FloorPlanGroup[];
  slug: string;
  onChange: (groups: FloorPlanGroup[]) => void;
}) {
  const setGroup = (gi: number, patch: Partial<FloorPlanGroup>) =>
    onChange(groups.map((g, i) => (i === gi ? { ...g, ...patch } : g)));
  const moveGroup = (gi: number, dir: -1 | 1) => {
    const j = gi + dir;
    if (j < 0 || j >= groups.length) return;
    const next = groups.slice();
    [next[gi], next[j]] = [next[j], next[gi]];
    onChange(next);
  };
  const addGroup = () =>
    onChange([
      ...groups,
      { id: `g${groups.length + 1}`, label: "New group", plans: [] },
    ]);

  const setPlans = (gi: number, plans: FloorPlan[]) =>
    setGroup(gi, { plans });
  const setPlan = (gi: number, pi: number, patch: Partial<FloorPlan>) =>
    setPlans(
      gi,
      groups[gi].plans.map((p, i) => (i === pi ? { ...p, ...patch } : p)),
    );
  const movePlan = (gi: number, pi: number, dir: -1 | 1) => {
    const plans = groups[gi].plans;
    const j = pi + dir;
    if (j < 0 || j >= plans.length) return;
    const next = plans.slice();
    [next[pi], next[j]] = [next[j], next[pi]];
    setPlans(gi, next);
  };

  return (
    <Field label={`Floor plan groups (${groups.length})`}>
      <div className="flex flex-col gap-4">
        {groups.map((g, gi) => (
          <div
            key={g.id || gi}
            className="flex flex-col gap-3 rounded-sm border border-[#2a2a2a] bg-[#0a0a0a] p-3"
          >
            <div className="flex items-center gap-2">
              <input
                className="flex-1 rounded-sm border border-[#464646] bg-[#0c0c0c] px-3 py-2 text-sm font-medium text-white outline-none focus:border-[#c19b4d]"
                placeholder="Group label (e.g. Tower A)"
                value={g.label}
                onChange={(e) => setGroup(gi, { label: e.target.value })}
              />
              <Btn onClick={() => moveGroup(gi, -1)} title="Move up">
                ↑
              </Btn>
              <Btn onClick={() => moveGroup(gi, 1)} title="Move down">
                ↓
              </Btn>
              <Btn
                variant="danger"
                onClick={() => onChange(groups.filter((_, i) => i !== gi))}
              >
                Delete group
              </Btn>
            </div>

            <div className="flex flex-col gap-3 pl-3">
              {g.plans.map((p, pi) => (
                <div
                  key={p.id || pi}
                  className="flex flex-col gap-3 rounded-sm border border-[#222] bg-[#0c0c0c] p-3"
                >
                  <div className="flex items-center gap-2">
                    <input
                      className="flex-1 rounded-sm border border-[#464646] bg-[#0c0c0c] px-3 py-2 text-sm text-white outline-none focus:border-[#c19b4d]"
                      placeholder="Plan label (e.g. 2 BHK)"
                      value={p.label}
                      onChange={(e) => setPlan(gi, pi, { label: e.target.value })}
                    />
                    <Btn onClick={() => movePlan(gi, pi, -1)} title="Move up">
                      ↑
                    </Btn>
                    <Btn onClick={() => movePlan(gi, pi, 1)} title="Move down">
                      ↓
                    </Btn>
                    <Btn
                      variant="danger"
                      onClick={() =>
                        setPlans(
                          gi,
                          g.plans.filter((_, i) => i !== pi),
                        )
                      }
                    >
                      ✕
                    </Btn>
                  </div>
                  <ImageField
                    label="Plan image"
                    value={p.image}
                    slug={slug}
                    onChange={(v) => setPlan(gi, pi, { image: v ?? { src: "" } })}
                  />
                  <MetricsField
                    items={p.metrics ?? []}
                    onChange={(metrics) => setPlan(gi, pi, { metrics })}
                  />
                  <StringListField
                    label="Features"
                    items={p.features ?? []}
                    placeholder="feature (e.g. East facing)"
                    onChange={(features) => setPlan(gi, pi, { features })}
                  />
                  <TextField
                    label="Note (optional)"
                    value={p.note}
                    onChange={(v) => setPlan(gi, pi, { note: v || undefined })}
                  />
                </div>
              ))}
              <Btn
                onClick={() =>
                  setPlans(gi, [...g.plans, emptyPlan(g.plans.length + 1)])
                }
              >
                + Add floor plan
              </Btn>
            </div>
          </div>
        ))}
        <Btn variant="gold" onClick={addGroup}>
          + Add group
        </Btn>
      </div>
    </Field>
  );
}

/* ---------------- landmarks ---------------- */

function LandmarksEditor({
  items,
  onChange,
}: {
  items: Landmark[];
  onChange: (items: Landmark[]) => void;
}) {
  const set = (i: number, patch: Partial<Landmark>) =>
    onChange(items.map((it, j) => (j === i ? { ...it, ...patch } : it)));
  return (
    <Field label={`Landmarks (${items.length})`}>
      <div className="flex flex-col gap-2">
        {items.map((it, i) => (
          <div
            key={i}
            className="flex flex-col gap-2 rounded-sm border border-[#2a2a2a] bg-[#0a0a0a] p-3 sm:flex-row sm:items-center"
          >
            <input
              className="flex-1 rounded-sm border border-[#464646] bg-[#0c0c0c] px-3 py-2 text-sm text-white outline-none focus:border-[#c19b4d]"
              placeholder="Name"
              value={it.name}
              onChange={(e) => set(i, { name: e.target.value })}
            />
            <select
              className="rounded-sm border border-[#464646] bg-[#0c0c0c] px-2 py-2 text-sm text-white"
              value={it.category}
              onChange={(e) =>
                set(i, { category: e.target.value as LandmarkCategory })
              }
            >
              {LANDMARK_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <input
              type="number"
              step={0.1}
              className="w-24 rounded-sm border border-[#464646] bg-[#0c0c0c] px-2 py-2 text-sm text-white outline-none focus:border-[#c19b4d]"
              placeholder="km"
              value={it.distanceKm ?? ""}
              onChange={(e) =>
                set(i, { distanceKm: Number(e.target.value) || 0 })
              }
            />
            <input
              type="number"
              className="w-24 rounded-sm border border-[#464646] bg-[#0c0c0c] px-2 py-2 text-sm text-white outline-none focus:border-[#c19b4d]"
              placeholder="min"
              value={it.minutes ?? ""}
              onChange={(e) => set(i, { minutes: Number(e.target.value) || 0 })}
            />
            <Btn
              variant="danger"
              onClick={() => onChange(items.filter((_, j) => j !== i))}
            >
              ✕
            </Btn>
          </div>
        ))}
        <Btn
          onClick={() =>
            onChange([
              ...items,
              { name: "", category: "transit", distanceKm: 0, minutes: 0 },
            ])
          }
        >
          + Add landmark
        </Btn>
      </div>
    </Field>
  );
}

/* ---------------- pillars ---------------- */

function PillarsEditor({
  items,
  onChange,
}: {
  items: Pillar[];
  onChange: (items: Pillar[]) => void;
}) {
  const set = (i: number, patch: Partial<Pillar>) =>
    onChange(items.map((it, j) => (j === i ? { ...it, ...patch } : it)));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = items.slice();
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  return (
    <Field label={`Pillars (${items.length})`}>
      <div className="flex flex-col gap-3">
        {items.map((it, i) => (
          <div
            key={it.id || i}
            className="flex flex-col gap-2 rounded-sm border border-[#2a2a2a] bg-[#0a0a0a] p-3"
          >
            <div className="flex items-center gap-2">
              <input
                className="flex-1 rounded-sm border border-[#464646] bg-[#0c0c0c] px-3 py-2 text-sm font-medium text-white outline-none focus:border-[#c19b4d]"
                placeholder="Title"
                value={it.title}
                onChange={(e) => set(i, { title: e.target.value })}
              />
              <select
                className="rounded-sm border border-[#464646] bg-[#0c0c0c] px-2 py-2 text-sm text-white"
                value={it.iconKey}
                onChange={(e) =>
                  set(i, { iconKey: e.target.value as Pillar["iconKey"] })
                }
              >
                {PILLAR_ICONS.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
              <Btn onClick={() => move(i, -1)} title="Move up">
                ↑
              </Btn>
              <Btn onClick={() => move(i, 1)} title="Move down">
                ↓
              </Btn>
              <Btn
                variant="danger"
                onClick={() => onChange(items.filter((_, j) => j !== i))}
              >
                ✕
              </Btn>
            </div>
            <textarea
              className="resize-y rounded-sm border border-[#464646] bg-[#0c0c0c] px-3 py-2 text-sm text-white outline-none focus:border-[#c19b4d]"
              rows={3}
              placeholder="Body"
              value={it.body}
              onChange={(e) => set(i, { body: e.target.value })}
            />
          </div>
        ))}
        <Btn
          variant="gold"
          onClick={() =>
            onChange([
              ...items,
              {
                id: `pillar-${items.length + 1}`,
                title: "",
                body: "",
                iconKey: "zero-out",
              },
            ])
          }
        >
          + Add pillar
        </Btn>
      </div>
    </Field>
  );
}

function Group({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-4">{children}</div>;
}

/* ---------------- factory ---------------- */

export function emptyDetail(): ProjectDetail {
  return {
    hero: { image: { src: "" } },
    intro: { headline: "" },
    summary: { cards: [] },
    highlights: { headline: "", items: [] },
    amenities: { headline: "Amenities", items: [] },
    masterPlan: { headline: "Master Plan", image: { src: "" } },
    floorPlans: { headline: "Floor Plans", groups: [] },
    specifications: { headline: "Specifications", items: [] },
    gallery: { headline: "Gallery", images: [] },
    location: { headline: "Location", coords: [0, 0], landmarks: [] },
    pillars: { items: [] },
    walkthrough: { headline: "Walkthrough", videoUrl: "" },
  };
}

export function makeNewProject(slug: string): Project {
  const clean = slug || "new-project";
  return {
    id: clean,
    slug: clean,
    name: "New Project",
    type: "residential",
    category: "",
    location: "",
    area: "",
    status: "Upcoming",
    images: [] as ImageRef[],
    detail: emptyDetail(),
  };
}
