module.exports = function(grunt){
	grunt.initConfig({
		dest_path:'distribution/',
		public_path:'public/',
		bower: {
		    install: {
		   		options: {
			        targetDir: 'libs/',
			        layout: 'byComponent',
			        install: true,
			        verbose: false,
			        cleanTargetDir: false,
			        cleanBowerDir: false,
			        bowerOptions: {}
		    	}
			}
		},
		'ftp-deploy':{
			build: {
				auth: {
					host: 'ftp.katlex.nichost.ru',
					port: 21,
					authKey: 'key1'
				},
				src: '<%=dest_path%>',
				dest: 'bashinsky.pro/docs/portfolio/snowboarding/',
			}
		},
		sass: {
	        options: {
	            sourceMap: true,
	            outputStyle:'expanded'
	        },
	        public: {
	            files: {
	                'css/main.css': 'sass/main.scss',
	                'css/top.css': 'sass/top.scss',
	                'css/ie8.css': 'sass/ie8.scss'
	            }
	        }
	    },
	    watch: {
			sass: {
				files: ['sass/**.scss'],
				tasks: ['sass'],
			    options: {
			      spawn: false,
			    }
			}
		},
		browserSync: {
            dev: {
                bsFiles: {
                    src : [
                        'css/*.css',
                        'index.html',
                        'js/script.js'
                    ]
                },
                options: {
                    watchTask: true,
                    server: './'
                }
            }
        },
		copy:{
			main:{
				files:[
					{src:'index.html',dest:'<%=public_path%>'},
					{src:'index.html',dest:'<%=dest_path%>'}
				]
			},
			css:{
				files:[
					{src:'css/*',dest:'<%=public_path%>'},
					{src:'css/*.css',dest:'<%=dest_path%>'}
				],
				options:{
		  			process:function(content,srcpath){
		  				content = content.replace(/\.\.\/fonts\/icons/g,'fonts/icons');
		  				return content;
		  			}
		  		}
			},
			js:{
				files:[
					{src:'js/*',dest:'<%=public_path%>'},
					{src:'js/*.js',dest:'<%=dest_path%>'}
				]
			},
			imgs:{
				files:[
					{src:'imgs/**',dest:'<%=public_path%>'},
					{src:'imgs/**',dest:'<%=dest_path%>'}
				]
			},
			pics:{
				files:[
					{src:'pics/**',dest:'<%=public_path%>'},
					{src:'pics/**',dest:'<%=dest_path%>'}
				]
			},
			libs:{
				files:[
					{src:'libs/**',dest:'<%=public_path%>'},
					{src:'libs/**',dest:'<%=dest_path%>'}
				]
			},
			sass:{
				files:[
					{src:'sass/**',dest:'<%=public_path%>'}
				]
			},
			fonts:{
				files:[
					{src:['fonts/icons/**','fonts/GothamPro/_GothamPro.scss','fonts/GothamPro/GothamProBold/**','fonts/GothamPro/GothamProLight/**'],dest:'<%=public_path%>'},
					{src:['fonts/icons/**','fonts/GothamPro/_GothamPro.scss','fonts/GothamPro/GothamProBold/**','fonts/GothamPro/GothamProLight/**'],dest:'<%=dest_path%>'},
				]
			},
			other:{
				files:[
					{src:['bower.json','Gruntfile.js','package.json','favicon.ico'],dest:'<%=public_path%>'},
					{src:['favicon.ico'],dest:'<%=dest_path%>'}
				]
			},
			php:{
				files:[
					{src:['handler.php','mysql.php'],dest:'<%=dest_path%>'},
					{src:['handler.php'],dest:'<%=public_path%>'}
				]
			}
		},
		postcss:{
			options:{
				map:false,
				processors:[
					require('autoprefixer')({browsers: 'last 10 versions'})
				]
			},
			dist:{
				src:['<%=dest_path%>css/*.css']
			}
		},
		cssmin:{
			options:{
				keepSpecialComments:0
			},
			main:{
				files:[
					{'<%=dest_path%>/css/main.css':'<%=dest_path%>/css/main.css'},
					{'<%=dest_path%>/css/top.css':'<%=dest_path%>/css/top.css'}
				]
			}
		},
		removelogging: {
			dist: {
		    	src: '<%=dest_path%>js/*'
			}
		},
		uglify:{
			dist:{
				files:[
					{'<%=dest_path%>js/script.js':'<%=dest_path%>js/script.js'}
				]
			}
		},
		imagemin:{
			imgs: {
			    files: [{
				    expand: true,
				    cwd: '<%=dest_path%>',
				    src: ['imgs/**.{png,jpg,gif}'],
				    dest: '<%=dest_path%>'
			    }]
			},
			pics: {
			    files: [{
				    expand: true,
				    cwd: '<%=dest_path%>',
				    src: ['pics/**.{png,jpg,gif}'],
				    dest: '<%=dest_path%>'
			    }]
			}
		},
		modernizr: {
			dist: {
				cache:false,
			    dest:"libs/modernizr.js",
			    customTests:[],
			    devFile:false,
			    outputFile:false,
			    crawl:false,
			    tests:[
			      'touchevents',
			      'csstransforms'
			    ],
			    options:[
			    	//'setClasses'
			    ],
			    uglify: true
			}
		},
		processhtml: {
			dist: {
		    	files: {
		        	'<%=dest_path%>index.html': '<%=dest_path%>index.html'
		     	}
		    }
		},
	});
	grunt.loadNpmTasks('grunt-bower-task');
	grunt.loadNpmTasks('grunt-ftp-deploy');
	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-postcss');
	grunt.loadNpmTasks('grunt-remove-logging');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-modernizr');
	grunt.loadNpmTasks('grunt-browser-sync');
	grunt.loadNpmTasks('grunt-processhtml');

	grunt.registerTask('default',['copy','postcss']);
	grunt.registerTask('bs-watch',['browserSync','watch:sass']);
	grunt.registerTask('ftp',['ftp-deploy']);
	grunt.registerTask('bw',['bower']);
	grunt.registerTask('build',['copy','postcss','cssmin','removelogging','uglify','imagemin','processhtml']);
}