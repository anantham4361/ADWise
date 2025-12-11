import React from 'react';
import { Mail, Github, Linkedin } from 'lucide-react';
import { useThemeStore } from '../../stores/themeStore';

const DevelopersSection: React.FC = () => {
  const { isDark } = useThemeStore();

  const developers = [
    {
      name: 'Anantha M',
      email: 'ananthamm.mca24@rvce.edu.in',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2',
      github: 'https://github.com/alexjohnson',
      linkedin: 'https://linkedin.com/in/alexjohnson'
    },
    {
      name: 'Kajal Vivek Singh Chauhan',
      email: 'kajalvs@rvce.edu.in',
      avatar: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2',
      github: 'https://github.com/sarahchen',
      linkedin: 'https://linkedin.com/in/sarahchen'
    }
  ];

  return (
    <section className={`py-20 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900 text-green-800 dark:text-green-200 text-sm font-semibold rounded-full">
              Our Team
            </span>
          </div>
          
          <h2 className={`text-3xl sm:text-4xl font-bold mb-6 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Meet the{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
              Developers
            </span>
          </h2>
          
          <p className={`text-lg max-w-2xl mx-auto ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            The talented team behind ADWISE, dedicated to revolutionizing ad testing with AI technology.
          </p>
        </div>

        {/* Developers Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {developers.map((developer, index) => (
            <div
              key={index}
              className={`group p-8 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                isDark 
                  ? 'bg-gray-900 hover:bg-gray-850 border border-gray-700' 
                  : 'bg-white hover:bg-gray-50 border border-gray-100 shadow-lg'
              }`}
            >
              {/* Avatar */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <img
                    src={developer.avatar}
                    alt={developer.name}
                    className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-gradient-to-r from-green-400 to-blue-500 group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 w-24 h-24 rounded-full bg-gradient-to-r from-green-400 to-blue-500 opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                </div>
              </div>

              {/* Developer Info */}
              <div className="text-center mb-6">
                <h3 className={`text-xl font-bold mb-2 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {developer.name}
                </h3>
                
                
                <a
                  href={`mailto:${developer.email}`}
                  className={`inline-flex items-center text-sm transition-colors ${
                    isDark 
                      ? 'text-gray-300 hover:text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  {developer.email}
                </a>
              </div>

              {/* Social Links */}
              <div className="flex justify-center space-x-4">
                <a
                  href={developer.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-3 rounded-lg transition-all duration-200 ${
                    isDark 
                      ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  aria-label={`${developer.name}'s GitHub`}
                >
                  <Github className="w-5 h-5" />
                </a>
                
                <a
                  href={developer.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-3 rounded-lg transition-all duration-200 ${
                    isDark 
                      ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  aria-label={`${developer.name}'s LinkedIn`}
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                
                <a
                  href={`mailto:${developer.email}`}
                  className={`p-3 rounded-lg transition-all duration-200 ${
                    isDark 
                      ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  aria-label={`Email ${developer.name}`}
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>

              {/* Decorative Element */}
              <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>

        {/* Bottom Message */}
        <div className="text-center mt-12">
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Have questions or want to collaborate? Feel free to reach out to our team!
          </p>
        </div>
      </div>
    </section>
  );
};

export default DevelopersSection;