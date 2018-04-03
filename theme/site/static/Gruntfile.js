module.exports = function(grunt) {
    
    grunt.initConfig({
        uglify: {
            dist: {
                files: {
                    'js/friend.min.js': 'js/friend.js'
                },
                options: {
                    compress: true,
                    report: 'gzip',
                    preserveComments: false
                }
            }
        },
        
        compress: {
            gzip: {
                options: {
                    mode: 'gzip',
                    level: 9
                },
                files: {
                    'js/friend.min.js.gz': 'js/friend.min.js'
                }
            },
            brotli: {
                options: {
                    mode: 'brotli',
                    brotli: {
                        mode: 1,
                        quality: 11
                    }
                },
                files: {
                    'js/friend.min.js.br': 'js/friend.min.js'
                }
            }
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-compress');
    
    grunt.registerTask('dist', [
        'uglify:dist',
        'compress:gzip',
        'compress:brotli'
    ]);
}