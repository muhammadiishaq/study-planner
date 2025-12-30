import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated Background Circles */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: '500px',
          height: '500px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          filter: 'blur(60px)'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-10%',
          left: '-5%',
          width: '400px',
          height: '400px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          filter: 'blur(60px)'
        }} />

        {/* Header */}
        <header style={{
          padding: window.innerWidth < 640 ? '20px' : '30px 50px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
          zIndex: 10,
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{
            fontSize: window.innerWidth < 640 ? '24px' : '32px',
            fontWeight: 'bold',
            color: 'white',
            textShadow: '0 2px 10px rgba(0,0,0,0.2)'
          }}>
            🎓 AlNafi Study Planner
          </div>
          <div style={{ 
            display: 'flex', 
            gap: window.innerWidth < 640 ? '8px' : '12px',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            <a
              href="https://alnafi.com/?al_aid=bbb8fe480970429"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: window.innerWidth < 640 ? '10px 20px' : '12px 24px',
                background: 'linear-gradient(135deg, #EC4899 0%, #F97316 100%)',
                color: 'white',
                borderRadius: '12px',
                fontWeight: 600,
                fontSize: window.innerWidth < 640 ? '14px' : '16px',
                textDecoration: 'none',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                whiteSpace: 'nowrap'
              }}
            >
              📚 Continue Study
            </a>
            <Link
              to="/login"
              style={{
                padding: window.innerWidth < 640 ? '10px 20px' : '12px 24px',
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                color: 'white',
                borderRadius: '12px',
                fontWeight: 600,
                fontSize: window.innerWidth < 640 ? '14px' : '16px',
                textDecoration: 'none',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                whiteSpace: 'nowrap'
              }}
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              style={{
                padding: window.innerWidth < 640 ? '10px 20px' : '12px 24px',
                background: 'white',
                color: '#667eea',
                borderRadius: '12px',
                fontWeight: 600,
                fontSize: window.innerWidth < 640 ? '14px' : '16px',
                textDecoration: 'none',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                whiteSpace: 'nowrap'
              }}
            >
              Sign Up
            </Link>
          </div>
        </header>

        {/* Hero Content */}
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: window.innerWidth < 640 ? '40px 20px' : '80px 50px',
          textAlign: 'center',
          position: 'relative',
          zIndex: 10
        }}>
          <h1 style={{
            fontSize: window.innerWidth < 640 ? '36px' : window.innerWidth < 768 ? '52px' : '72px',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: window.innerWidth < 640 ? '20px' : '30px',
            textShadow: '0 4px 20px rgba(0,0,0,0.3)',
            lineHeight: 1.2
          }}>
            Master Your AlNafi<br />Diploma Journey
          </h1>

          <p style={{
            fontSize: window.innerWidth < 640 ? '18px' : window.innerWidth < 768 ? '22px' : '26px',
            color: 'rgba(255, 255, 255, 0.95)',
            marginBottom: window.innerWidth < 640 ? '40px' : '60px',
            textShadow: '0 2px 10px rgba(0,0,0,0.2)',
            lineHeight: 1.6,
            padding: '0 20px',
            maxWidth: '900px',
            margin: '0 auto',
            marginBottom: window.innerWidth < 640 ? '40px' : '60px'
          }}>
            Your smart companion to track progress, schedule study sessions,<br />
            and achieve your educational goals! 🚀
          </p>

          <div style={{
            display: 'flex',
            flexDirection: window.innerWidth < 640 ? 'column' : 'row',
            gap: '20px',
            justifyContent: 'center',
            marginBottom: window.innerWidth < 640 ? '50px' : '80px',
            padding: '0 20px'
          }}>
            <Link
              to="/signup"
              style={{
                padding: window.innerWidth < 640 ? '18px 50px' : '24px 60px',
                background: 'white',
                color: '#667eea',
                borderRadius: '16px',
                fontWeight: 'bold',
                fontSize: window.innerWidth < 640 ? '18px' : '22px',
                textDecoration: 'none',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
                display: 'inline-block',
                transition: 'transform 0.3s'
              }}
            >
              🚀 Start Studying Today 
            </Link>
            <a
              href="https://alnafi.com/?al_aid=bbb8fe480970429"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: window.innerWidth < 640 ? '18px 50px' : '24px 60px',
                background: 'linear-gradient(135deg, #EC4899 0%, #F97316 100%)',
                color: 'white',
                borderRadius: '16px',
                fontWeight: 'bold',
                fontSize: window.innerWidth < 640 ? '18px' : '22px',
                textDecoration: 'none',
                boxShadow: '0 10px 40px rgba(236, 72, 153, 0.4)',
                display: 'inline-block',
                transition: 'transform 0.3s'
              }}
            >
              📚 Continue Study at AlNafi
            </a>
          </div>

          {/* Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: window.innerWidth < 640 ? '1fr' : 'repeat(3, 1fr)',
            gap: window.innerWidth < 640 ? '20px' : '40px',
            maxWidth: '900px',
            margin: '0 auto',
            padding: '0 20px'
          }}>
            {[
              { number: '4+', label: 'Diploma Programs', icon: '🎓' },
                { number: '1000+', label: 'Active Students', icon: '👩‍🎓👨‍🎓' },
              { number: '24/7', label: 'Access Anywhere', icon: '🌍' }
            ].map((stat, index) => (
              <div key={index} style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                padding: window.innerWidth < 640 ? '30px 20px' : '40px 30px',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>
                  {stat.icon}
                </div>
                <div style={{
                  fontSize: window.innerWidth < 640 ? '42px' : '56px',
                  fontWeight: 'bold',
                  color: 'white',
                  marginBottom: '8px'
                }}>
                  {stat.number}
                </div>
                <div style={{
                  fontSize: window.innerWidth < 640 ? '16px' : '18px',
                  color: 'rgba(255, 255, 255, 0.9)'
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div style={{
        padding: window.innerWidth < 640 ? '80px 20px' : '120px 50px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{ textAlign: 'center', marginBottom: window.innerWidth < 640 ? '50px' : '80px' }}>
          <h2 style={{
            fontSize: window.innerWidth < 640 ? '32px' : '48px',
            fontWeight: 'bold',
            color: '#1F2937',
            marginBottom: '20px'
          }}>
            ✨ Everything You Need to Succeed
          </h2>
          <p style={{
            fontSize: window.innerWidth < 640 ? '18px' : '22px',
            color: '#6B7280',
            maxWidth: '700px',
            margin: '0 auto',
            lineHeight: 1.6
          }}>
            Powerful tools designed specifically for AlNafi College students
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: window.innerWidth < 768 ? '1fr' : 'repeat(3, 1fr)',
          gap: window.innerWidth < 640 ? '30px' : '40px'
        }}>
          {[
            {
              icon: '📊',
              title: 'Track Your Progress',
              desc: 'Monitor completion percentage for each diploma in real-time. Upload your AlNafi progress reports and watch your dashboard update automatically!'
            },
            {
              icon: '📅',
              title: 'Smart Study Scheduler',
              desc: 'Plan your study sessions with ease. Set start times, end times, and track how many hours you spend on each course. Stay organized!'
            },
            {
              icon: '🔔',
              title: 'Email Reminders',
              desc: 'Never miss a study session! Get automatic email notifications 15 minutes before each scheduled session starts.'
            },
            {
              icon: '📤',
              title: 'One-Click Report Upload',
              desc: 'Upload your AlNafi progress report PDF and let our AI automatically extract your completion percentages. No manual entry needed!'
            },
            {
              icon: '🎯',
              title: 'Multi-Diploma Support',
              desc: 'Taking multiple diplomas? No problem! Track Cyber Security, DevOps, Cloud Computing, and more - all in one place.'
            },
            {
              icon: '📱',
              title: 'Works Everywhere',
              desc: 'Fully responsive design works perfectly on your phone, tablet, or desktop. Study from anywhere, anytime!'
            }
          ].map((feature, index) => (
            <div key={index} style={{
              background: 'white',
              borderRadius: '24px',
              padding: window.innerWidth < 640 ? '32px' : '40px',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
              transition: 'transform 0.3s, box-shadow 0.3s',
              cursor: 'pointer',
              border: '1px solid #E5E7EB'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.08)';
            }}
            >
              <div style={{ 
                fontSize: window.innerWidth < 640 ? '52px' : '64px', 
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                {feature.icon}
              </div>
              <h3 style={{
                fontSize: window.innerWidth < 640 ? '22px' : '26px',
                fontWeight: 'bold',
                color: '#1F2937',
                marginBottom: '16px',
                textAlign: 'center'
              }}>
                {feature.title}
              </h3>
              <p style={{
                fontSize: window.innerWidth < 640 ? '15px' : '17px',
                color: '#6B7280',
                lineHeight: 1.7,
                textAlign: 'center'
              }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works Section */}
      <div style={{
        background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
        padding: window.innerWidth < 640 ? '80px 20px' : '100px 50px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: window.innerWidth < 640 ? '32px' : '48px',
            fontWeight: 'bold',
            color: '#1F2937',
            marginBottom: window.innerWidth < 640 ? '50px' : '80px',
            textAlign: 'center'
          }}>
            🚀 How It Works
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: window.innerWidth < 768 ? '1fr' : 'repeat(4, 1fr)',
            gap: window.innerWidth < 640 ? '40px' : '30px'
          }}>
            {[
              { step: '1', icon: '📝', title: 'Sign Up Free', desc: 'Create your account in seconds' },
              { step: '2', icon: '🎓', title: 'Select Diploma', desc: 'Choose your AlNafi diploma program' },
              { step: '3', icon: '📊', title: 'Track Progress', desc: 'Upload reports and monitor completion' },
              { step: '4', icon: '🏆', title: 'Achieve Goals', desc: 'Complete your diploma successfully!' }
            ].map((item, index) => (
              <div key={index} style={{
                textAlign: 'center',
                position: 'relative'
              }}>
                <div style={{
                  width: window.innerWidth < 640 ? '80px' : '100px',
                  height: window.innerWidth < 640 ? '80px' : '100px',
                  background: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                  fontSize: window.innerWidth < 640 ? '40px' : '48px'
                }}>
                  {item.icon}
                </div>
                <div style={{
                  fontSize: window.innerWidth < 640 ? '20px' : '24px',
                  fontWeight: 'bold',
                  color: '#667eea',
                  marginBottom: '12px'
                }}>
                  Step {item.step}
                </div>
                <h3 style={{
                  fontSize: window.innerWidth < 640 ? '20px' : '22px',
                  fontWeight: 'bold',
                  color: '#1F2937',
                  marginBottom: '12px'
                }}>
                  {item.title}
                </h3>
                <p style={{
                  fontSize: window.innerWidth < 640 ? '15px' : '16px',
                  color: '#6B7280',
                  lineHeight: 1.6
                }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: window.innerWidth < 640 ? '80px 20px' : '100px 50px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: window.innerWidth < 640 ? '32px' : '48px',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '24px',
            lineHeight: 1.3
          }}>
            Ready to Transform Your Study Experience? 🎯
          </h2>
          <p style={{
            fontSize: window.innerWidth < 640 ? '18px' : '22px',
            color: 'rgba(255, 255, 255, 0.9)',
            marginBottom: window.innerWidth < 640 ? '40px' : '60px',
            lineHeight: 1.7
          }}>
            Join students who are organizing their AlNafi journey and achieving success!<br />
            Start tracking your progress today - completely free! 💯
          </p>
          <div style={{
            display: 'flex',
            flexDirection: window.innerWidth < 640 ? 'column' : 'row',
            gap: '20px',
            justifyContent: 'center'
          }}>
            <Link
              to="/signup"
              style={{
                padding: window.innerWidth < 640 ? '18px 50px' : '22px 60px',
                background: 'white',
                color: '#667eea',
                borderRadius: '16px',
                fontWeight: 'bold',
                fontSize: window.innerWidth < 640 ? '18px' : '22px',
                textDecoration: 'none',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                display: 'inline-block'
              }}
            >
              🎓 Create Free Account
            </Link>
            <Link
              to="/login"
              style={{
                padding: window.innerWidth < 640 ? '18px 50px' : '22px 60px',
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                color: 'white',
                border: '2px solid white',
                borderRadius: '16px',
                fontWeight: 'bold',
                fontSize: window.innerWidth < 640 ? '18px' : '22px',
                textDecoration: 'none',
                display: 'inline-block'
              }}
            >
              Already a member? Sign In →
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#1F2937',
        padding: window.innerWidth < 640 ? '50px 20px' : '70px 50px',
        color: 'white'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: window.innerWidth < 640 ? '28px' : '32px',
            fontWeight: 'bold',
            marginBottom: '16px'
          }}>
            🎓 AlNafi Study Planner
          </div>
          <p style={{
            fontSize: window.innerWidth < 640 ? '16px' : '18px',
            color: '#9CA3AF',
            marginBottom: '32px',
            lineHeight: 1.6
          }}>
            Your smart companion for AlNafi College success
          </p>
          <div style={{
            display: 'flex',
            gap: '30px',
            justifyContent: 'center',
            marginBottom: '32px',
            flexWrap: 'wrap'
          }}>
            <a
              href="https://alnafi.com/?al_aid=bbb8fe480970429"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#9CA3AF',
                textDecoration: 'none',
                fontSize: window.innerWidth < 640 ? '16px' : '18px',
                transition: 'color 0.3s'
              }}
              onMouseEnter={(e) => e.target.style.color = 'white'}
              onMouseLeave={(e) => e.target.style.color = '#9CA3AF'}
            >
              📚 AlNafi College
            </a>
            <Link
              to="/login"
              style={{
                color: '#9CA3AF',
                textDecoration: 'none',
                fontSize: window.innerWidth < 640 ? '16px' : '18px'
              }}
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              style={{
                color: '#9CA3AF',
                textDecoration: 'none',
                fontSize: window.innerWidth < 640 ? '16px' : '18px'
              }}
            >
              Sign Up
            </Link>
          </div>
          <div style={{
            fontSize: window.innerWidth < 640 ? '14px' : '16px',
            color: '#6B7280',
            paddingTop: '32px',
            borderTop: '1px solid #374151'
          }}>
            © 2025 AlNafi Study Planner. Made with ❤️ for AlNafi students.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;