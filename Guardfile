# A sample Guardfile
# More info at https://github.com/guard/guard#readme

require 'guard/guard'

module ::Guard
  class GoServer < ::Guard::Guard
    def run_all
    end

    def run_on_changes(paths)
        recompile
    end

    def recompile
        compiled = system "GOPATH=#{Dir.pwd}/server; go build server/src/main.go"
        if compiled
            restart_server
        end
    end

    def restart_server
        puts "restarting..."
        pid = IO.read("tmp/pid")
        system "kill #{pid}"
        fork do
            system "./main"
        end
    end
  end
end

guard :go_server do
  watch(%r{^.*\.go$})
end