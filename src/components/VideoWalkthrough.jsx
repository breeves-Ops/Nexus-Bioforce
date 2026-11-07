import {
  bodyStyle,
  dividerStyle,
  eyebrowStyle,
  headingStyle,
  innerStyle,
  sectionStyle,
} from './declaration/declarationStyles'

const WALKTHROUGH_VIDEO_SRC = '/video/aethelred-walkthrough.mp4'

const WALKTHROUGH_POSTER_SRC = '/video/aethelred-walkthrough-poster.jpg'

export default function VideoWalkthrough() {
  return (
    <section id="the-walkthrough" data-nexus-section="walkthrough" style={sectionStyle}>
      <div style={innerStyle}>
        <div className="nexus-video-grid">
          <div className="nexus-video-copy">
            <div className="nd2-eyebrow" style={eyebrowStyle}>
              WATCH · PROJECT AETHELRED
            </div>
            <h2 className="nd2-heading" style={headingStyle}>
              Inside the
              <br />
              Resource Revolution
            </h2>
            <div className="nd2-divider" style={dividerStyle} />
            <p style={bodyStyle}>
              A walkthrough of Project Aethelred at 18511 Beaumont Hwy — the site plan, the material
              recovery line, and the energy systems that turn Houston's waste stream into feedstock
              and power.
            </p>
            <div className="nexus-video-meta">Video · 9:39 · Houston, Texas</div>
          </div>
          <div className="nexus-video-frame">
            <video
              controls={true}
              playsInline={true}
              preload="none"
              poster={WALKTHROUGH_POSTER_SRC}
              aria-label="Project Aethelred video walkthrough"
            >
              <source src={WALKTHROUGH_VIDEO_SRC} type="video/mp4" />
              Your browser can't play this video.{' '}
              <a
                href={WALKTHROUGH_VIDEO_SRC}
                style={{
                  color: '#00e5c8',
                }}
              >
                Open the video file
              </a>
              .
            </video>
          </div>
        </div>
      </div>
    </section>
  )
}
