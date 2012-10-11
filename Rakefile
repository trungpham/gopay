#!/usr/bin/env rake
# Add your own tasks in files placed in lib/tasks ending in .rake,
# for example lib/tasks/capistrano.rake, and they will automatically be available to Rake.

require 'rubygems'
require 'bundler'

Bundler.require

require 'rake/sprocketstask.rb'

class ClientCompiler < Closure::Compiler
  def compress(original)
    "(function(){#{super(original)}})();"
  end
end

Rake::SprocketsTask.new 'client_assets' do |t|
  t.environment = Sprockets::Environment.new do |env|
    %w[javascripts stylesheets images].each do |path|
      env.append_path "client/#{path}"
    end
    env.js_compressor = ClientCompiler.new :compilation_level => 'ADVANCED_OPTIMIZATIONS'
  end
  t.output = "public/assets"
  t.assets = %w[client.js application.css *.png *.jpeg]
end
begin
  require 'jasmine'
  load 'jasmine/tasks/jasmine.rake'
rescue LoadError
  task :jasmine do
    abort "Jasmine is not available. In order to run jasmine, you must: (sudo) gem install jasmine"
  end
end
