import 'dotenv';

type environmentType =
  { type?: 'string', value?: string } |
  { type?: 'number', value?: number } |
  { type?: 'boolean', value?: boolean } |
  { type?: 'json', value?: Object };

interface EnvironmentInput {
  environmentName: string;
  live?: boolean;
  defaultValue?: any;
}
type EnvironmentVariable = EnvironmentInput & environmentType;

type CustomVariable = {
  environmentName: string;
  value: any;
}


export class Environment {

  private envMap = new Map<string, EnvironmentVariable>();

  constructor() {
    this.addEnvironmentVariable({ environmentName: 'NODE_ENV' });

    this.addCustomVariable({ environmentName: 'CWD', value: process.cwd() });
  }

  public addCustomVariable(variable: CustomVariable): any {
    const options: EnvironmentVariable = {
      environmentName: variable.environmentName,
      live: false,
      value: variable.value,
      defaultValue: variable.value,
      type: 'json'
    }

    this.envMap.set(variable.environmentName, options);

    return options.value;
  }

  public addEnvironmentVariable(variable: EnvironmentVariable): any {
    const options = Object.assign({ environmentName: '', live: false, defaultValue: variable.environmentName, type: 'string' } as EnvironmentVariable, variable);
    
    switch(options.type) {
      case 'number':
        options.value = Number(process.env[options.environmentName]) || options.defaultValue;
        break;
      case 'boolean':
        options.value = process.env[options.environmentName] === 'true';
        break;
      case 'json':
        options.value = process.env[options.environmentName] ? JSON.parse(process.env[options.environmentName] as string) : {};
        break;
      default:
        options.value = process.env[options.environmentName] || options.defaultValue;
    }
    

    this.envMap.set(variable.environmentName, options);

    return options.value;
  }

  public get(variableName: string): any {
    if (this.envMap.has(variableName)) {
      const env = this.envMap.get(variableName) as EnvironmentVariable;
      return env.value;
    }

    return '';
  }
}

export default new Environment();