#!/usr/bin/env rake
# Add your own tasks in files placed in lib/tasks ending in .rake,
# for example lib/tasks/capistrano.rake, and they will automatically be available to Rake.

require 'rake/sprocketstask.rb'

require 'closure-compiler'

Rake::SprocketsTask.new do |t|
  t.environment = Sprockets::Environment.new do |env|
    %w[javascripts stylesheets images].each do |path|
      env.append_path "client/#{path}"
    end
    env.js_compressor = Closure::Compiler.new
  end
  t.output = "public/assets"
  t.assets = %w[client.js application.css *.png *.jpeg]
end