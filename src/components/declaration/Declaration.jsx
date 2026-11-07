import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  ALLIANCE_PILLARS,
  CAMPUS_ZONES,
  CAPEX_BREAKDOWN,
  CAPEX_SUMMARY,
  CORE_SYSTEMS,
  HOUSTON_HISTORY,
  PRINCIPLES,
  PROBLEM_STATS,
  REVENUE_STREAMS,
  ROADMAP,
  SITE_FEATURES,
  STATE_INITIATIVES,
  TOKENS,
  TOKEN_LIFECYCLE,
  VISION_PILLARS,
} from './declarationData'
import {
  allianceCardStyle,
  bodyStyle,
  capexCardStyle,
  cardTextStyle,
  cardTitleStyle,
  dividerStyle,
  eyebrowStyle,
  gridStyle,
  headingStyle,
  historyCardStyle,
  innerStyle,
  principleCardStyle,
  principleNumberStyle,
  priorityStyle,
  quoteStyle,
  rootStyle,
  sectionStyle,
  siteCardStyle,
  siteIconStyle,
  statCardStyle,
  statItemStyle,
  statLabelStyle,
  statListStyle,
  statValueStyle,
  systemCardStyle,
  systemLabelStyle,
  tableCellStyle,
  tableHeadStyle,
  tableStyle,
  tokenCardStyle,
  tokenDetailStyle,
  tokenSymbolStyle,
  visionCardStyle,
  visionIconStyle,
  zoneCardStyle,
} from './declarationStyles'

gsap.registerPlugin(ScrollTrigger)

const TOGGLE_ACTIONS = 'play none none none'

function useDeclarationAnimations(n) {
  useEffect(() => {
    const e = gsap.context(() => {
      gsap.utils.toArray('.nd2-eyebrow').forEach((t) => {
        gsap.fromTo(
          t,
          {
            x: -16,
            opacity: 0.4,
          },
          {
            x: 0,
            opacity: 1,
            duration: 0.5,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: t,
              start: 'top 95%',
              toggleActions: TOGGLE_ACTIONS,
            },
          },
        )
      })
      gsap.utils.toArray('.nd2-heading').forEach((t) => {
        gsap.fromTo(
          t,
          {
            y: 30,
            opacity: 0.3,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: t,
              start: 'top 95%',
              toggleActions: TOGGLE_ACTIONS,
            },
          },
        )
      })
      gsap.utils.toArray('.nd2-grid').forEach((t) => {
        const i = t.querySelectorAll('.nd2-card')
        if (i.length) {
          gsap.fromTo(
            i,
            {
              y: 24,
              opacity: 0.3,
              scale: 0.98,
            },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.6,
              ease: 'power2.out',
              stagger: 0.08,
              scrollTrigger: {
                trigger: t,
                start: 'top 92%',
                toggleActions: TOGGLE_ACTIONS,
              },
            },
          )
        }
      })
      gsap.utils.toArray('.nd2-stat-bar').forEach((t) => {
        gsap.fromTo(
          t,
          {
            scaleX: 0,
            transformOrigin: 'left center',
          },
          {
            scaleX: 1,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: t,
              start: 'top 90%',
              toggleActions: TOGGLE_ACTIONS,
            },
          },
        )
      })
      gsap.utils.toArray('.nd2-divider').forEach((t) => {
        gsap.fromTo(
          t,
          {
            scaleX: 0,
            transformOrigin: 'left',
          },
          {
            scaleX: 1,
            duration: 0.9,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: t,
              start: 'top 95%',
              toggleActions: TOGGLE_ACTIONS,
            },
          },
        )
      })
      gsap.utils.toArray('.nd2-quote').forEach((t) => {
        gsap.fromTo(
          t,
          {
            x: -20,
            opacity: 0.3,
          },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: t,
              start: 'top 93%',
              toggleActions: TOGGLE_ACTIONS,
            },
          },
        )
      })
    }, n)
    return () => e.revert()
  }, [n])
}

export default function Declaration() {
  const n = useRef(null)
  useDeclarationAnimations(n)
  return (
    <div id="nexus-declaration" ref={n} style={rootStyle}>
      <section
        id="the-preamble"
        data-nexus-section="preamble"
        style={{
          ...sectionStyle,
          background: 'rgba(4,10,12,0.85)',
        }}
      >
        <div style={innerStyle}>
          <div className="nd2-eyebrow" style={eyebrowStyle}>
            THE INSTITUTIONAL RECORD · 2013–2026
          </div>
          <h2 className="nd2-heading" style={headingStyle}>
            Thirteen Years of
            <br />
            Institutional Persistence
          </h2>
          <div className="nd2-divider" style={dividerStyle} />
          <p style={bodyStyle}>
            The Nexus Bioforce Resource Revolution does not begin in 2026. It begins in 2013 — with
            a Bloomberg Philanthropies prize, a federal grant proposal, a canceled procurement, and
            thirteen years of institutional persistence in the face of political reversal, budget
            crisis, and systemic municipal inertia.
          </p>
          <div
            className="nd2-grid"
            style={{
              ...gridStyle,
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              marginTop: '2.5rem',
            }}
          >
            {HOUSTON_HISTORY.map((e) => (
              <div key={e.year} className="nd2-card" style={historyCardStyle}>
                <div
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: '0.62rem',
                    letterSpacing: '0.2em',
                    color: '#00e5c8',
                    opacity: 0.7,
                    marginBottom: '0.5rem',
                  }}
                >
                  {e.era}
                </div>
                <div
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: '1.4rem',
                    fontWeight: 800,
                    color: 'rgba(200,215,228,0.9)',
                    marginBottom: '0.5rem',
                  }}
                >
                  {e.year}
                </div>
                <h3
                  style={{
                    ...cardTitleStyle,
                    fontSize: '0.9rem',
                    marginBottom: '0.6rem',
                  }}
                >
                  {e.title}
                </h3>
                <p
                  style={{
                    ...cardTextStyle,
                    fontSize: '0.78rem',
                  }}
                >
                  {e.text}
                </p>
              </div>
            ))}
          </div>
          <blockquote
            className="nd2-quote"
            style={{
              ...quoteStyle,
              marginTop: '2.5rem',
            }}
          >{`"The history of Houston's solid waste is a history of deferred accountability. The Nexus Bioforce Resource Revolution is the institutional answer to that history: a circular economy that turns the site of greatest environmental harm into the engine of greatest environmental and economic restoration."`}</blockquote>
        </div>
      </section>
      <section id="the-declaration" data-nexus-section="declaration" style={sectionStyle}>
        <div style={innerStyle}>
          <div className="nd2-eyebrow" style={eyebrowStyle}>
            THE FOUNDING DECLARATION
          </div>
          <h2 className="nd2-heading" style={headingStyle}>
            The Constitution of
            <br />
            the Circular Economy
          </h2>
          <div className="nd2-divider" style={dividerStyle} />
          <blockquote className="nd2-quote" style={quoteStyle}>
            {
              '"We hold these truths to be self-evident in the age of abundance: that the linear economy which extracts, uses, and discards is not merely inefficient — it is a form of civilizational self-harm."'
            }
          </blockquote>
          <p
            style={{
              ...bodyStyle,
              marginTop: '1.5rem',
            }}
          >
            {
              'That every landfill is a stranded asset. That every molecule of graphene buried in a garbage heap is a solar panel not built, a semiconductor not manufactured, a life-saving medical device not created. That the State of Texas — as the energy capital of the world and the first state to establish a Strategic Bitcoin Reserve (SB 21, signed June 20, 2025) — is uniquely positioned to be the first '
            }
            <strong
              style={{
                color: '#00e5c8',
              }}
            >
              Circular Sovereign Economy
            </strong>
            {' on earth.'}
          </p>
          <p
            style={{
              ...bodyStyle,
              color: '#00e5c8',
              fontWeight: 600,
              marginTop: '1rem',
            }}
          >
            We therefore declare the establishment of the Nexus Bioforce Resource Revolution.
          </p>
          <div
            className="nd2-grid"
            style={{
              ...gridStyle,
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              marginTop: '3rem',
            }}
          >
            {PRINCIPLES.map((e) => (
              <div key={e.n} className="nd2-card" style={principleCardStyle}>
                <div style={principleNumberStyle}>{e.n}</div>
                <h3 style={cardTitleStyle}>{e.title}</h3>
                <p style={cardTextStyle}>{e.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section id="the-problem" data-nexus-section="problem" style={sectionStyle}>
        <div style={innerStyle}>
          <div className="nd2-eyebrow" style={eyebrowStyle}>
            PART I / THE COLLAPSE
          </div>
          <h2 className="nd2-heading" style={headingStyle}>
            The Collapse of the
            <br />
            Linear Economy
          </h2>
          <div className="nd2-divider" style={dividerStyle} />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '3rem',
              alignItems: 'start',
            }}
          >
            <div>
              <h3
                style={{
                  ...cardTitleStyle,
                  color: '#00e5c8',
                  fontSize: '1.1rem',
                  marginBottom: '1rem',
                }}
              >
                The Great Material Stranding
              </h3>
              <p style={bodyStyle}>
                {'The global economy generates '}
                <strong
                  style={{
                    color: '#fff',
                  }}
                >
                  2.56 billion metric tons
                </strong>
                {
                  ' of municipal solid waste annually — projected to reach 3.86 billion by 2050. In the U.S., 50% is still landfilled. Within that discarded material: the entire supply chain of the 21st century — graphene precursors, rare earths, lithium, cobalt, neodymium.'
                }
              </p>
              <p
                style={{
                  ...bodyStyle,
                  marginTop: '1rem',
                }}
              >
                {'Global e-waste reached '}
                <strong
                  style={{
                    color: '#fff',
                  }}
                >
                  62 million tonnes
                </strong>
                {' in 2022 — only 22.3% formally recycled — with '}
                <strong
                  style={{
                    color: 'rgba(195,210,225,0.9)',
                  }}
                >
                  $91 billion
                </strong>
                {
                  ' in critical metals unaccounted for. China refines 85–90% of all rare earth elements globally. The United States is'
                }{' '}
                <strong
                  style={{
                    color: '#fff',
                  }}
                >
                  100% import-reliant for yttrium
                </strong>
                {' and 80% reliant for rare-earth compounds overall.'}
              </p>
            </div>
            <div>
              <h3
                style={{
                  ...cardTitleStyle,
                  color: '#00e5c8',
                  fontSize: '1.1rem',
                  marginBottom: '1rem',
                }}
              >
                The Data Center Paradox
              </h3>
              <p style={bodyStyle}>
                {'AI hyperscale data centers consume '}
                <strong
                  style={{
                    color: '#fff',
                  }}
                >
                  449 million gallons per day
                </strong>
                {' of cooling water. Texas data centers are projected to require '}
                <strong
                  style={{
                    color: 'rgba(195,210,225,0.9)',
                  }}
                >
                  399 billion gallons by 2030
                </strong>
                {
                  ' — equivalent to drawing Lake Mead down 16 feet per year. The ERCOT large-load interconnection queue stood at'
                }{' '}
                <strong
                  style={{
                    color: '#fff',
                  }}
                >
                  225.8 GW
                </strong>
                {' as of December 2025, with data centers representing 72.9% of that queue.'}
              </p>
              <p
                style={{
                  ...bodyStyle,
                  marginTop: '1rem',
                }}
              >
                Between May 2024 and March 2025, community opposition blocked{' '}
                <strong
                  style={{
                    color: 'rgba(195,210,225,0.9)',
                  }}
                >
                  $64 billion
                </strong>
                {
                  ' in planned projects — $18B blocked outright, $46B delayed — across 142 activist groups in 24 states.'
                }
              </p>
            </div>
          </div>
          <div
            className="nd2-grid"
            style={{
              ...gridStyle,
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              marginTop: '3rem',
            }}
          >
            {PROBLEM_STATS.map((e) => (
              <div key={e.num} className="nd2-card" style={statCardStyle}>
                <span style={statValueStyle}>{e.num}</span>
                <span style={statLabelStyle}>{e.label}</span>
              </div>
            ))}
          </div>
          <blockquote
            className="nd2-quote"
            style={{
              ...quoteStyle,
              marginTop: '3rem',
            }}
          >
            {
              '"The AI systems that will govern the next century cannot be powered by the extractive logic of the last one. They require a fundamentally different relationship to matter, energy, and community."'
            }
          </blockquote>
        </div>
      </section>
      <section id="the-site" data-nexus-section="site" style={sectionStyle}>
        <div style={innerStyle}>
          <div className="nd2-eyebrow" style={eyebrowStyle}>
            PART II / THE SITE · 18511 BEAUMONT HWY
          </div>
          <h2 className="nd2-heading" style={headingStyle}>
            Project Aethelred
          </h2>
          <p
            style={{
              ...bodyStyle,
              color: 'rgba(0,229,200,0.65)',
              fontSize: '1rem',
              fontWeight: 600,
              marginBottom: '0.5rem',
            }}
          >
            50-Acre Brownfield · Houston, Texas · San Jacinto River and Rail Park
          </p>
          <div className="nd2-divider" style={dividerStyle} />
          <p style={bodyStyle}>
            {
              'Built on 13 years of institutional persistence — from a 2013 Bloomberg Philanthropies $1M Mayors Challenge prize for "One Bin for All," through a $492.6M federal REMADE proposal with 100+ partners in 2016 (Nexus Bioforce contributed $197.7M — 46.8% of total industry match), to the executed MOU COH-NBF-2026-001 with the City of Houston under Mayor Whitmire and SWMD Director Larius Hassen.'
            }
          </p>
          <p
            style={{
              ...bodyStyle,
              marginTop: '1rem',
            }}
          >
            {'The 50-acre site sits adjacent to the '}
            <strong
              style={{
                color: '#fff',
              }}
            >
              San Jacinto River Waste Pits Superfund site
            </strong>
            {
              ' — EPA-listed 2008, contaminated by dioxin from 1960s paper mill waste. Final 100% Remedial Design for the Northern Impoundment approved September 2025. Project Aethelred proposes to convert this liability into an asset: FJH at 3,000 K thermally destroys dioxins while recovering carbon, minerals, and energy from the remediated material.'
            }
          </p>
          <div
            className="nd2-grid"
            style={{
              ...gridStyle,
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              marginTop: '2.5rem',
            }}
          >
            {SITE_FEATURES.map((e) => (
              <div key={e.title} className="nd2-card" style={siteCardStyle}>
                <div style={siteIconStyle}>{e.icon}</div>
                <h4
                  style={{
                    ...cardTitleStyle,
                    fontSize: '0.9rem',
                    marginBottom: '0.4rem',
                  }}
                >
                  {e.title}
                </h4>
                <p
                  style={{
                    ...cardTextStyle,
                    fontSize: '0.8rem',
                  }}
                >
                  {e.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section id="the-technology" data-nexus-section="technology" style={sectionStyle}>
        <div style={innerStyle}>
          <div className="nd2-eyebrow" style={eyebrowStyle}>
            PART III / TECHNOLOGY
          </div>
          <h2 className="nd2-heading" style={headingStyle}>
            The Nexus Bioforce
            <br />
            Matter Engine
          </h2>
          <div className="nd2-divider" style={dividerStyle} />
          <p style={bodyStyle}>
            {'At the core of Project Aethelred is the '}
            <strong
              style={{
                color: '#00e5c8',
              }}
            >
              Flash Joule Heating (FJH) Matter Engine
            </strong>
            {
              ' — developed by the Tour Group at Rice University (Nature 577, 647–651, 2020) and scaled commercially by Universal Matter. FJH achieves temperatures exceeding '
            }
            <strong
              style={{
                color: '#fff',
              }}
            >
              3,000 Kelvin within 10–100 milliseconds
            </strong>
            {
              ' via capacitor discharge. All non-carbon elements volatilize into recoverable streams. The residual carbon restructures into turbostratic graphene — a rotationally disordered 2D lattice with superior dispersibility in concrete, polymers, and asphalt.'
            }
          </p>
          <div
            className="nd2-grid"
            style={{
              ...gridStyle,
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              marginTop: '2.5rem',
            }}
          >
            {CORE_SYSTEMS.map((e) => (
              <div key={e.name} className="nd2-card" style={systemCardStyle}>
                <div style={systemLabelStyle}>SYSTEM</div>
                <h3
                  style={{
                    ...cardTitleStyle,
                    color: '#00e5c8',
                  }}
                >
                  {e.name}
                </h3>
                <p style={cardTextStyle}>{e.desc}</p>
                {e.stats && (
                  <ul style={statListStyle}>
                    {e.stats.map((t) => (
                      <li key={t} style={statItemStyle}>
                        {t}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
          <div
            style={{
              ...gridStyle,
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              marginTop: '2.5rem',
            }}
          >
            {CAMPUS_ZONES.map((e) => (
              <div key={e.name} className="nd2-card" style={zoneCardStyle}>
                <div
                  style={{
                    ...eyebrowStyle,
                    fontSize: '0.6rem',
                    marginBottom: '0.6rem',
                  }}
                >
                  {e.dir}
                  {' HALL'}
                </div>
                <h4
                  style={{
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    margin: '0 0 0.5rem',
                  }}
                >
                  {e.name}
                </h4>
                <p
                  style={{
                    ...cardTextStyle,
                    fontSize: '0.78rem',
                  }}
                >
                  {e.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section id="the-economy" data-nexus-section="economy" style={sectionStyle}>
        <div style={innerStyle}>
          <div className="nd2-eyebrow" style={eyebrowStyle}>
            PART IV / THE BIO-TOKEN ECONOMY
          </div>
          <h2 className="nd2-heading" style={headingStyle}>
            The Digital Currency of
            <br />
            Environmental Redemption
          </h2>
          <div className="nd2-divider" style={dividerStyle} />
          <blockquote className="nd2-quote" style={quoteStyle}>
            {
              '"For the first time in human history, the act of minting currency requires improving the physical world. Every Bio-Token is a certificate of environmental healing."'
            }
          </blockquote>
          <p
            style={{
              ...bodyStyle,
              marginTop: '1.5rem',
            }}
          >
            {'Built on '}
            <strong
              style={{
                color: '#fff',
              }}
            >
              Hedera Hashgraph
            </strong>
            {
              ' — aBFT consensus, formally verified in the Coq proof assistant. >10,000 TPS, finality <5 seconds, ~$0.0001/tx, 0.00025 kWh/tx (vs. ~2.95 kWh Ethereum). The broader tokenized real-world asset market: '
            }
            <strong
              style={{
                color: 'rgba(195,210,225,0.9)',
              }}
            >
              $25B+ by Q2 2025
            </strong>
            , projected $18.9 trillion by 2033 (Ripple/BCG).
          </p>
          <div
            className="nd2-grid"
            style={{
              ...gridStyle,
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              marginTop: '2.5rem',
            }}
          >
            {TOKENS.map((e) => (
              <div key={e.symbol} className="nd2-card" style={tokenCardStyle}>
                <div style={tokenSymbolStyle}>{e.symbol}</div>
                <h3
                  style={{
                    ...cardTitleStyle,
                    color: 'rgba(195,210,225,0.9)',
                    fontSize: '1rem',
                  }}
                >
                  {e.name}
                </h3>
                <p style={cardTextStyle}>{e.desc}</p>
                <div style={tokenDetailStyle}>{e.detail}</div>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: '2.5rem',
              padding: '1.5rem 2rem',
              background: 'rgba(0,229,200,0.04)',
              border: '1px solid rgba(0,229,200,0.12)',
              borderRadius: '6px',
            }}
          >
            <div
              style={{
                ...eyebrowStyle,
                marginBottom: '1rem',
              }}
            >
              MINTING PROTOCOL — 6-STAGE VERIFICATION
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '0.8rem',
              }}
            >
              {TOKEN_LIFECYCLE.map((e, t) => (
                <div
                  key={t}
                  style={{
                    display: 'flex',
                    gap: '0.8rem',
                    alignItems: 'flex-start',
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: '0.7rem',
                      color: '#00e5c8',
                      minWidth: '1.5rem',
                      paddingTop: '0.1rem',
                    }}
                  >
                    {t + 1}.
                  </span>
                  <span
                    style={{
                      fontSize: '0.78rem',
                      color: 'rgba(200,220,228,0.7)',
                      lineHeight: 1.5,
                    }}
                  >
                    {e}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section id="the-alliance" data-nexus-section="amazon" style={sectionStyle}>
        <div style={innerStyle}>
          <div className="nd2-eyebrow" style={eyebrowStyle}>
            PART V / THE AMAZON ALLIANCE
          </div>
          <h2 className="nd2-heading" style={headingStyle}>
            Computing Sovereignty
            <br />
            for the Circular Age
          </h2>
          <div className="nd2-divider" style={dividerStyle} />
          <p style={bodyStyle}>
            AWS has committed to 100% renewable energy (achieved 2023, seven years ahead of target),
            net-zero carbon by 2040, and water-positive by 2030. These commitments are incompatible
            with the current hyperscale siting model, under which $64B in projects were blocked
            between May 2024–March 2025. Project Aethelred resolves the crisis.
          </p>
          <div
            className="nd2-grid"
            style={{
              ...gridStyle,
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              marginTop: '2.5rem',
            }}
          >
            {ALLIANCE_PILLARS.map((e) => (
              <div key={e.title} className="nd2-card" style={allianceCardStyle}>
                <div
                  style={{
                    fontSize: '1.8rem',
                    marginBottom: '0.8rem',
                  }}
                >
                  {e.icon}
                </div>
                <h3
                  style={{
                    ...cardTitleStyle,
                    color: '#00e5c8',
                    fontSize: '1rem',
                  }}
                >
                  {e.title}
                </h3>
                <p style={cardTextStyle}>{e.text}</p>
              </div>
            ))}
          </div>
          <blockquote
            className="nd2-quote"
            style={{
              ...quoteStyle,
              marginTop: '2.5rem',
            }}
          >
            {
              '"AWS-Aethelred is the only hyperscale configuration that allows enterprise customers to say, truthfully and verifiably, that their data is processed by infrastructure that removes more carbon from the atmosphere than it emits — and generates its own water from air."'
            }
          </blockquote>
          <p
            style={{
              ...bodyStyle,
              marginTop: '1.5rem',
              fontSize: '0.85rem',
              color: 'rgba(200,220,228,0.55)',
            }}
          >
            Microsoft Azure pursues Direct Air Capture at $600–$1,000/tonne. Google Cloud's 24/7
            carbon-free energy operates in only three regions. Neither is water-positive. Neither is
            carbon-negative. AWS-Aethelred is both.
          </p>
        </div>
      </section>
      <section id="the-state" data-nexus-section="texas" style={sectionStyle}>
        <div style={innerStyle}>
          <div className="nd2-eyebrow" style={eyebrowStyle}>
            PART VI / THE STATE OF TEXAS
          </div>
          <h2 className="nd2-heading" style={headingStyle}>
            The First Circular
            <br />
            Sovereign Economy
          </h2>
          <div className="nd2-divider" style={dividerStyle} />
          <p style={bodyStyle}>
            {
              'Texas has the waste streams — Houston generates >11,500 tons of MSW per day (4.2M tons/year). Dallas-Fort Worth adds 11.8 million tons annually. Texas has the infrastructure — the Houston Ship Channel provides deep-water export access. Texas has the political framework — SB 21 (Strategic Bitcoin Reserve, signed June 20, 2025) and the combined incentive stack of'
            }{' '}
            <strong
              style={{
                color: 'rgba(195,210,225,0.9)',
              }}
            >
              $412–$432 million
            </strong>
            {' in lifetime value (TIRMA, JETI Act, Chapter 312 abatements).'}
          </p>
          <div
            className="nd2-grid"
            style={{
              ...gridStyle,
              gridTemplateColumns: '1fr 1fr',
              marginTop: '2.5rem',
            }}
          >
            <div
              className="nd2-card"
              style={{
                ...systemCardStyle,
                borderTopColor: '#00e5c8',
              }}
            >
              <h3
                style={{
                  ...cardTitleStyle,
                  color: '#00e5c8',
                }}
              >
                Houston
              </h3>
              <p style={cardTextStyle}>
                Capital of the Circular Economy. The San Jacinto corridor — adjacent to the
                Superfund site (final excavation plan approved September 2025) — is converted from
                liability to asset. FJH thermally destroys 60-year-old dioxins while recovering
                graphene, minerals, and energy.
              </p>
              <div
                style={{
                  ...statListStyle,
                  marginTop: '1rem',
                }}
              >
                <span style={statItemStyle}>4.2M tons MSW/year city-wide</span>
                <span style={statItemStyle}>641K tons SWMD-collected</span>
                <span style={statItemStyle}>$412–$432M incentive stack</span>
              </div>
            </div>
            <div
              className="nd2-card"
              style={{
                ...systemCardStyle,
                borderTopColor: '#00e5c8',
              }}
            >
              <h3
                style={{
                  ...cardTitleStyle,
                  color: 'rgba(195,210,225,0.9)',
                }}
              >
                Dallas
              </h3>
              <p style={cardTextStyle}>
                Capital of the Bio-Economy Currency. Home of the Texas Stock Exchange (TXSE) —
                SEC-approved September 30, 2025, trading targeted July 2026. $270M raised from
                BlackRock, Goldman, J.P. Morgan. 82 total investor entities with combined market cap
                exceeding $2 trillion.
              </p>
              <div
                style={{
                  ...statListStyle,
                  marginTop: '1rem',
                }}
              >
                <span style={statItemStyle}>11.8M tons MSW (DFW/year)</span>
                <span style={statItemStyle}>McCommas Bluff — Facility One</span>
                <span style={statItemStyle}>NBCEX — Bio-Economy Currency Exchange</span>
              </div>
            </div>
          </div>
          <div
            style={{
              marginTop: '2.5rem',
              padding: '1.5rem 2rem',
              background: 'rgba(0,229,200,0.03)',
              border: '1px solid rgba(0,229,200,0.08)',
              borderRadius: '6px',
            }}
          >
            <div
              style={{
                ...eyebrowStyle,
                marginBottom: '1rem',
              }}
            >
              THE TEXAS CIRCULAR SOVEREIGNTY LEGISLATION
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.8rem',
              }}
            >
              {STATE_INITIATIVES.map((e, t) => (
                <div
                  key={t}
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'flex-start',
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: '0.65rem',
                      color: 'rgba(0,229,200,0.5)',
                      minWidth: '2.5rem',
                      paddingTop: '0.1rem',
                    }}
                  >
                    §{t + 9}
                  </span>
                  <span
                    style={{
                      fontSize: '0.82rem',
                      color: 'rgba(200,220,228,0.72)',
                      lineHeight: 1.6,
                    }}
                  >
                    {e}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section id="the-factory" data-nexus-section="sentient" style={sectionStyle}>
        <div style={innerStyle}>
          <div className="nd2-eyebrow" style={eyebrowStyle}>
            PART VIII / BIOLOGICAL INTELLIGENCE
          </div>
          <h2 className="nd2-heading" style={headingStyle}>
            The Sentient Factory
          </h2>
          <div className="nd2-divider" style={dividerStyle} />
          <p style={bodyStyle}>
            The Nexus Bioforce facility violates every assumption of conventional automation
            simultaneously. Its feedstock is the most heterogeneous material stream in industrial
            production. Its core process operates at 3,000 Kelvin with microsecond timescale
            dynamics. What is required is a control system that learns, adapts, predicts, and
            self-organizes in real time.
          </p>
          <div
            className="nd2-grid"
            style={{
              ...gridStyle,
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              marginTop: '2.5rem',
            }}
          >
            <div className="nd2-card" style={systemCardStyle}>
              <div style={systemLabelStyle}>EXECUTIVE AI</div>
              <h3
                style={{
                  ...cardTitleStyle,
                  color: '#00e5c8',
                }}
              >
                SILVIA
              </h3>
              <p
                style={{
                  ...cardTextStyle,
                  fontFamily: "'DM Mono', monospace",
                  fontSize: '0.72rem',
                  color: 'rgba(0,229,200,0.7)',
                  marginBottom: '0.8rem',
                }}
              >
                Symbolically Isolated Linguistically Variable Intelligence Architecture
              </p>
              <p style={cardTextStyle}>
                Operating on a compact 5MB footprint, SILVIA translates high-dimensional stochastic
                biological reservoir output into deterministic, zero-hallucination control commands
                verified by Spectral Renormalization Group filtering: D(x) = y. Every output is
                mathematically proven correct before execution. SILVIA's Attention Anchoring
                mechanism prevents semantic drift during extended continuous operation at 3,000 K
                plasma dynamics.
              </p>
            </div>
            <div className="nd2-card" style={systemCardStyle}>
              <div style={systemLabelStyle}>BIO-SYNTHETIC COMPUTE</div>
              <h3
                style={{
                  ...cardTitleStyle,
                  color: '#00e5c8',
                }}
              >
                F-Node CHIMERA
              </h3>
              <p
                style={{
                  ...cardTextStyle,
                  fontFamily: "'DM Mono', monospace",
                  fontSize: '0.72rem',
                  color: 'rgba(0,229,200,0.7)',
                  marginBottom: '0.8rem',
                }}
              >
                Conductive Hyphal Interpenetrating Mycelial Electronic Reservoir Array
              </p>
              <p style={cardTextStyle}>
                Shiitake mycelium functionalized with PEDOT:PSS — a biological reservoir computer
                processing sensor telemetry through quantum proton tunneling. The mycelial network's
                natural memory (45-minute timescale) is calibrated to the facility's operational
                rhythms: the FJH pulse cycle, anaerobic digester fermentation kinetics, and ERCOT
                real-time energy market pricing cycles. A BIO is the first currency backed by life.
              </p>
            </div>
            <div className="nd2-card" style={systemCardStyle}>
              <div style={systemLabelStyle}>KNOWLEDGE ARCHITECTURE</div>
              <h3
                style={{
                  ...cardTitleStyle,
                  color: '#00e5c8',
                }}
              >
                Semantic Diffusion
              </h3>
              <p style={cardTextStyle}>
                The Heat Equation on Riemannian manifolds applied to information propagation across
                the facility's dense operational knowledge graph. The practical consequence: SILVIA
                knows, 17 minutes before feedstock reaches the reactor, that a composition drift
                detected by Machine X's hyperspectral imaging will require a compensatory adjustment
                to Levidian LOOP plasma electron density. Industrial precognition.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section id="the-vision" data-nexus-section="vision" style={sectionStyle}>
        <div style={innerStyle}>
          <div className="nd2-eyebrow" style={eyebrowStyle}>
            PART IX / THE VISION
          </div>
          <h2 className="nd2-heading" style={headingStyle}>
            The Abundant Society
          </h2>
          <div className="nd2-divider" style={dividerStyle} />
          <blockquote className="nd2-quote" style={quoteStyle}>
            {
              '"Abundance is not the absence of scarcity. It is the architecture of systems whose outputs exceed their inputs — systems that produce more value than they consume, more order than they disorder, more life than they destroy."'
            }
          </blockquote>
          <div
            className="nd2-grid"
            style={{
              ...gridStyle,
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              marginTop: '3rem',
            }}
          >
            {VISION_PILLARS.map((e) => (
              <div key={e.title} className="nd2-card" style={visionCardStyle}>
                <div style={visionIconStyle}>{e.icon}</div>
                <h3
                  style={{
                    ...cardTitleStyle,
                    fontSize: '1rem',
                  }}
                >
                  {e.title}
                </h3>
                <p
                  style={{
                    ...cardTextStyle,
                    fontSize: '0.8rem',
                  }}
                >
                  {e.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section id="the-roadmap" data-nexus-section="roadmap" style={sectionStyle}>
        <div style={innerStyle}>
          <div className="nd2-eyebrow" style={eyebrowStyle}>
            PART X / IMPLEMENTATION ROADMAP
          </div>
          <h2 className="nd2-heading" style={headingStyle}>
            The 2026 Critical Path
          </h2>
          <div className="nd2-divider" style={dividerStyle} />
          <div
            style={{
              overflowX: 'auto',
            }}
          >
            <table style={tableStyle}>
              <thead>
                <tr>
                  {['Priority', 'Action', 'Deadline', 'Value Unlocked'].map((e) => (
                    <th key={e} style={tableHeadStyle}>
                      {e}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROADMAP.map((e) => (
                  <tr
                    key={e.action}
                    style={{
                      borderBottom: '1px solid rgba(0,229,200,0.07)',
                    }}
                  >
                    <td
                      style={{
                        ...tableCellStyle,
                        ...priorityStyle(e.priority),
                      }}
                    >
                      {e.priority}
                    </td>
                    <td style={tableCellStyle}>{e.action}</td>
                    <td
                      style={{
                        ...tableCellStyle,
                        fontFamily: "'DM Mono', monospace",
                        color: 'rgba(180,200,215,0.8)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {e.deadline}
                    </td>
                    <td
                      style={{
                        ...tableCellStyle,
                        color: '#00e5c8',
                        fontSize: '0.78rem',
                      }}
                    >
                      {e.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <section id="the-financials" data-nexus-section="financials" style={sectionStyle}>
        <div style={innerStyle}>
          <div className="nd2-eyebrow" style={eyebrowStyle}>
            PART XI / FINANCIAL ARCHITECTURE
          </div>
          <h2 className="nd2-heading" style={headingStyle}>
            Eight-Stream Revenue Model
          </h2>
          <div className="nd2-divider" style={dividerStyle} />
          <div
            style={{
              overflowX: 'auto',
              marginTop: '1rem',
            }}
          >
            <table style={tableStyle}>
              <thead>
                <tr>
                  {['Revenue Stream', 'Base Case', 'Bull Case'].map((e) => (
                    <th key={e} style={tableHeadStyle}>
                      {e}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {REVENUE_STREAMS.map((e) => (
                  <tr
                    key={e.stream}
                    style={{
                      borderBottom: '1px solid rgba(0,229,200,0.07)',
                    }}
                  >
                    <td style={tableCellStyle}>{e.stream}</td>
                    <td
                      style={{
                        ...tableCellStyle,
                        color: '#00e5c8',
                        fontWeight: 600,
                        fontFamily: "'DM Mono', monospace",
                      }}
                    >
                      {e.base}
                    </td>
                    <td
                      style={{
                        ...tableCellStyle,
                        color: 'rgba(195,210,225,0.9)',
                        fontWeight: 600,
                        fontFamily: "'DM Mono', monospace",
                      }}
                    >
                      {e.bull}
                    </td>
                  </tr>
                ))}
                <tr
                  style={{
                    borderTop: '2px solid rgba(0,229,200,0.2)',
                    background: 'rgba(0,229,200,0.04)',
                  }}
                >
                  <td
                    style={{
                      ...tableCellStyle,
                      fontWeight: 700,
                      color: '#fff',
                    }}
                  >
                    TOTAL
                  </td>
                  <td
                    style={{
                      ...tableCellStyle,
                      color: '#00e5c8',
                      fontWeight: 800,
                      fontFamily: "'DM Mono', monospace",
                      fontSize: '1rem',
                    }}
                  >
                    ~$1.929B
                  </td>
                  <td
                    style={{
                      ...tableCellStyle,
                      color: 'rgba(195,210,225,0.9)',
                      fontWeight: 800,
                      fontFamily: "'DM Mono', monospace",
                      fontSize: '1rem',
                    }}
                  >
                    ~$3.1B+
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div
            style={{
              marginTop: '2.5rem',
              overflowX: 'auto',
            }}
          >
            <div
              style={{
                ...eyebrowStyle,
                marginBottom: '1rem',
              }}
            >
              CAPEX v4.0 — INCLUDING BITCOIN INFRASTRUCTURE
            </div>
            <table style={tableStyle}>
              <thead>
                <tr>
                  {['CapEx Category', 'Cost', '% Total'].map((e) => (
                    <th key={e} style={tableHeadStyle}>
                      {e}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CAPEX_BREAKDOWN.map((e) => (
                  <tr
                    key={e.cat}
                    style={{
                      borderBottom: '1px solid rgba(0,229,200,0.07)',
                    }}
                  >
                    <td style={tableCellStyle}>{e.cat}</td>
                    <td
                      style={{
                        ...tableCellStyle,
                        color: 'rgba(195,210,225,0.85)',
                        fontFamily: "'DM Mono', monospace",
                        fontWeight: 600,
                      }}
                    >
                      {e.cost}
                    </td>
                    <td
                      style={{
                        ...tableCellStyle,
                        color: 'rgba(180,200,215,0.5)',
                        fontFamily: "'DM Mono', monospace",
                      }}
                    >
                      {e.pct}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div
            className="nd2-grid"
            style={{
              ...gridStyle,
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              marginTop: '2.5rem',
            }}
          >
            {CAPEX_SUMMARY.map((e) => (
              <div key={e.label} className="nd2-card" style={capexCardStyle}>
                <span
                  style={{
                    ...statValueStyle,
                    fontSize: 'clamp(1.4rem, 2.5vw, 2rem)',
                  }}
                >
                  {e.val}
                </span>
                <span style={statLabelStyle}>{e.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section
        id="the-conclusion"
        data-nexus-section="conclusion"
        style={{
          ...sectionStyle,
          textAlign: 'center',
          background: 'rgba(4,10,12,0.9)',
        }}
      >
        <div
          style={{
            ...innerStyle,
            alignItems: 'center',
          }}
        >
          <div className="nd2-eyebrow" style={eyebrowStyle}>
            CONCLUSION
          </div>
          <h2
            className="nd2-heading"
            style={{
              ...headingStyle,
              textAlign: 'center',
              maxWidth: '18ch',
              margin: '0 auto 1.5rem',
            }}
          >
            The Revolution Begins Here
          </h2>
          <div
            className="nd2-divider"
            style={{
              ...dividerStyle,
              margin: '0 auto 2rem',
            }}
          />
          <p
            style={{
              ...bodyStyle,
              textAlign: 'center',
              maxWidth: '70ch',
              margin: '0 auto 2rem',
            }}
          >
            The technology exists. The site is located. The regulatory framework is being built. The
            partnerships are forming. The currency architecture is designed. The vision of the
            Abundant Society is not a utopian fantasy — it is a thermodynamic specification, an
            engineering plan, and a business case that generates{' '}
            <strong
              style={{
                color: '#00e5c8',
              }}
            >
              $1.929 billion in annual revenue
            </strong>
            {' from material that other people throw away.'}
          </p>
          <p
            style={{
              ...bodyStyle,
              textAlign: 'center',
              maxWidth: '60ch',
              margin: '0 auto 1.5rem',
              fontSize: '0.85rem',
              color: 'rgba(200,220,228,0.55)',
            }}
          >
            Ten facilities would process 28 million tons of MSW annually — producing 3.08 million MT
            of graphene, 840,000 MT of green hydrogen, recovering 2.1 million tonnes of critical
            minerals, and minting Bio-Economy Currency backed by these outputs at a rate that would
            make the combined BEC reserve the largest commodity-backed digital currency system in
            world history.
          </p>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem',
              marginTop: '2rem',
            }}
          >
            <div
              style={{
                ...eyebrowStyle,
                fontSize: '0.7rem',
                color: 'rgba(200,168,75,0.6)',
              }}
            >
              SIGNED
            </div>
            <div
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 'clamp(1.4rem, 3vw, 2.2rem)',
                fontWeight: 800,
                color: '#fff',
                letterSpacing: '-0.02em',
              }}
            >
              Brandon Reeves
            </div>
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: '0.7rem',
                color: 'rgba(200,168,75,0.7)',
                letterSpacing: '0.12em',
              }}
            >
              {'FOUNDER & CHIEF VISIONARY · NEXUS BIOFORCE RESOURCE REVOLUTION'}
            </div>
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: '0.65rem',
                color: 'rgba(180,200,210,0.4)',
                letterSpacing: '0.08em',
                marginTop: '0.3rem',
              }}
            >
              18511 BEAUMONT HIGHWAY · HOUSTON, TEXAS 77049 · 2026
            </div>
          </div>
          <div
            style={{
              marginTop: '3rem',
              padding: '1rem 2rem',
              background: 'rgba(200,168,75,0.06)',
              border: '1px solid rgba(200,168,75,0.2)',
              borderRadius: '4px',
            }}
          >
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: '0.62rem',
                letterSpacing: '0.16em',
                color: 'rgba(200,168,75,0.55)',
                textTransform: 'uppercase',
              }}
            >
              The Revolution begins in Houston. It spreads to Dallas. It captures Texas.
              <br />
              It demonstrates to the world that the Abundant Society is not a dream deferred — it is
              a specification waiting to be built.
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
