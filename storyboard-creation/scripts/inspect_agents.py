import inspect

def main():
    try:
        import agents
        from agents import Agent, ModelSettings
        from openai.types.shared import Reasoning
    except Exception as e:
        print('IMPORT_ERROR:', e)
        return

    print('agents attrs subset:', [n for n in dir(agents) if n in ('"run"','"respond"','"chat"','"stream"','"complete"','"responses"','"__all__"')])
    print('has responses.create:', hasattr(getattr(agents, 'responses', None), 'create'))

    agent = Agent(name='Probe', instructions='Respond with JSON only.', model_settings=ModelSettings(reasoning=Reasoning(effort='minimal'), verbosity='low'))

    methods = [m for m in dir(agent) if callable(getattr(agent,m)) and not m.startswith('_')]
    print('Agent callables:', methods)

    for name in methods:
        try:
            print('sig', 'agent.'+name, inspect.signature(getattr(agent,name)))
        except Exception:
            pass
    for helper in ('run','respond','chat','stream','complete'):
        if hasattr(agents, helper):
            try:
                print('sig', 'agents.'+helper, inspect.signature(getattr(agents,helper)))
            except Exception:
                print('sig', 'agents.'+helper, '<no-signature>')
            try:
                print('doc', 'agents.'+helper, inspect.getdoc(getattr(agents, helper)))
            except Exception:
                pass
            obj = getattr(agents, helper)
            # If it's a module, inspect its callables
            if hasattr(obj, '__package__') and not callable(obj):
                names = [n for n in dir(obj) if not n.startswith('_')]
                print('subattrs of agents.'+helper+':', names)
                callables = [n for n in names if callable(getattr(obj,n))]
                print('subcallables of agents.'+helper+':', callables)
                for n in callables:
                    fn = getattr(obj, n)
                    try:
                        print('sig', f'agents.{helper}.{n}', inspect.signature(fn))
                    except Exception:
                        print('sig', f'agents.{helper}.{n}', '<no-signature>')

    print('--- attempting calls ---')
    prompts = ["Say hello"]
    for helper in ('run',):
        if hasattr(agents, helper):
            fn = getattr(agents, helper)
            if hasattr(fn, '__package__') and not callable(fn):
                # Try agents.run.run and agents.run.main
                sub = getattr(fn, 'run', None) or getattr(fn, 'main', None)
                if sub:
                    for ptext in prompts:
                        try:
                            print('try run.run(agent, input=...)')
                            out = sub(agent, input=ptext)
                            print('ok run.run ->', type(out), getattr(out, 'output_text', str(out))[:120])
                        except Exception as e:
                            print('err run.run agent,input=', type(e), e)

if __name__ == '__main__':
    main()
